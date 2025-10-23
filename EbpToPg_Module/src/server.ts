/**
 * Serveur API pour la synchronisation EBP vers PostgreSQL
 * Expose des endpoints REST pour gérer la synchronisation et les backups
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import syncRoutes from './routes/sync.routes';
import backupRoutes from './routes/backup.routes';
import DatabaseService from './services/database.service';
import EBPClient from '../clients/ebp.clients';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/sync', syncRoutes);
app.use('/api/backup', backupRoutes);

// Route de santé
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Vérifier la connexion EBP
    let ebpStatus = 'disconnected';
    try {
      await EBPClient.connect();
      await EBPClient.query('SELECT 1');
      ebpStatus = 'connected';
    } catch (error) {
      console.error('Erreur de connexion EBP:', error);
    }

    // Vérifier la connexion PostgreSQL
    let pgStatus = 'disconnected';
    try {
      const pool = DatabaseService.getPool();
      await pool.query('SELECT 1');
      pgStatus = 'connected';
    } catch (error) {
      console.error('Erreur de connexion PostgreSQL:', error);
    }

    const isHealthy = ebpStatus === 'connected' && pgStatus === 'connected';

    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      connections: {
        ebp: ebpStatus,
        postgresql: pgStatus,
      },
      environment: {
        ebpServer: process.env.CLIENT_EBP_SERVER,
        ebpDatabase: process.env.CLIENT_EBP_DATABASE,
        pgDatabase: process.env.PG_DATABASE,
      },
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      error: (error as Error).message,
    });
  }
});

// Route racine avec documentation
app.get('/', (req: Request, res: Response) => {
  return res.json({
    name: 'EBP to PostgreSQL Sync API',
    version: '1.0.0',
    description: 'API pour synchroniser la base de données EBP vers PostgreSQL',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Vérifier l\'état de santé du serveur et des connexions',
      },
      sync: {
        full: {
          method: 'POST',
          path: '/api/sync/full',
          description: 'Synchronisation complète (DROP + CREATE ou TRUNCATE + INSERT)',
          body: {
            tables: 'string[] (optionnel) - Tables à synchroniser',
            dropAndCreate: 'boolean (optionnel) - true = DROP + CREATE, false = TRUNCATE',
            batchSize: 'number (optionnel) - Taille des batchs (défaut: 1000)',
            schema: 'string (optionnel) - Schéma MSSQL (défaut: dbo)',
          },
        },
        verify: {
          method: 'POST',
          path: '/api/sync/verify',
          description: 'Vérifier la synchronisation entre EBP et PostgreSQL',
          body: {
            tables: 'string[] (optionnel) - Tables à vérifier',
            sampleSize: 'number (optionnel) - Nombre de lignes à vérifier (défaut: 100)',
            checkAllRows: 'boolean (optionnel) - Vérifier toutes les lignes',
            schema: 'string (optionnel) - Schéma MSSQL (défaut: dbo)',
          },
        },
        repair: {
          method: 'POST',
          path: '/api/sync/repair',
          description: 'Réparer la synchronisation basée sur les résultats de vérification',
          body: {
            verificationResults: 'VerificationResult[] - Résultats de vérification OU',
            tables: 'string[] - Tables à resynchroniser',
            dropAndCreate: 'boolean (optionnel)',
            schema: 'string (optionnel)',
          },
        },
        tables: {
          method: 'GET',
          path: '/api/sync/tables',
          description: 'Lister toutes les tables disponibles dans EBP',
          query: {
            schema: 'string (optionnel) - Schéma MSSQL (défaut: dbo)',
          },
        },
      },
      backup: {
        create: {
          method: 'POST',
          path: '/api/backup/create',
          description: 'Créer un dump de la base de données PostgreSQL',
          body: {
            format: 'plain | custom | directory | tar (défaut: plain)',
            compress: 'boolean (défaut: true)',
            tables: 'string[] (optionnel) - Tables spécifiques',
            schemaOnly: 'boolean (optionnel)',
            dataOnly: 'boolean (optionnel)',
          },
        },
        list: {
          method: 'GET',
          path: '/api/backup/list',
          description: 'Lister tous les backups existants',
        },
        delete: {
          method: 'DELETE',
          path: '/api/backup/:fileName',
          description: 'Supprimer un backup spécifique',
        },
        cleanup: {
          method: 'POST',
          path: '/api/backup/cleanup',
          description: 'Nettoyer les anciens backups',
          body: {
            keepCount: 'number (défaut: 10) - Nombre de backups à conserver',
          },
        },
      },
    },
    examples: {
      fullSync: {
        description: 'Synchronisation complète de toutes les tables avec DROP + CREATE',
        curl: `curl -X POST http://localhost:${PORT}/api/sync/full -H "Content-Type: application/json" -d '{"dropAndCreate": true}'`,
      },
      syncSpecificTables: {
        description: 'Synchroniser uniquement les tables customers et items',
        curl: `curl -X POST http://localhost:${PORT}/api/sync/full -H "Content-Type: application/json" -d '{"tables": ["customers", "items"], "dropAndCreate": false}'`,
      },
      verify: {
        description: 'Vérifier la synchronisation des tables customers et items',
        curl: `curl -X POST http://localhost:${PORT}/api/sync/verify -H "Content-Type: application/json" -d '{"tables": ["customers", "items"], "sampleSize": 100}'`,
      },
      backup: {
        description: 'Créer un backup complet en format SQL',
        curl: `curl -X POST http://localhost:${PORT}/api/backup/create -H "Content-Type: application/json" -d '{"format": "plain"}'`,
      },
    },
  });
});

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    method: req.method,
  });
});

// Gestion globale des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur non gérée:', err);
  return res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message,
  });
});

// Initialisation du serveur
async function startServer() {
  try {
    console.log('\n========================================');
    console.log('DÉMARRAGE DU SERVEUR');
    console.log('========================================\n');

    // Initialiser la connexion EBP
    console.log('Connexion à la base de données EBP...');
    await EBPClient.connect();
    console.log('✓ Connecté à EBP');

    // Initialiser la connexion PostgreSQL et créer la base si nécessaire
    console.log('\nInitialisation de PostgreSQL...');
    await DatabaseService.initializePool(true);
    console.log('✓ PostgreSQL initialisé');

    // Démarrer le serveur Express
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log(`✓ Serveur démarré sur http://localhost:${PORT}`);
      console.log('========================================\n');
      console.log('Endpoints disponibles:');
      console.log(`  - GET  http://localhost:${PORT}/`);
      console.log(`  - GET  http://localhost:${PORT}/health`);
      console.log(`  - POST http://localhost:${PORT}/api/sync/full`);
      console.log(`  - POST http://localhost:${PORT}/api/sync/verify`);
      console.log(`  - POST http://localhost:${PORT}/api/sync/repair`);
      console.log(`  - GET  http://localhost:${PORT}/api/sync/tables`);
      console.log(`  - POST http://localhost:${PORT}/api/backup/create`);
      console.log(`  - GET  http://localhost:${PORT}/api/backup/list`);
      console.log(`  - DEL  http://localhost:${PORT}/api/backup/:fileName`);
      console.log(`  - POST http://localhost:${PORT}/api/backup/cleanup`);
      console.log('\n========================================\n');
    });
  } catch (error) {
    console.error('✗ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gérer l'arrêt propre du serveur
process.on('SIGINT', async () => {
  console.log('\n\nArrêt du serveur...');
  await DatabaseService.close();
  console.log('✓ Connexions fermées');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nArrêt du serveur...');
  await DatabaseService.close();
  console.log('✓ Connexions fermées');
  process.exit(0);
});

// Démarrer le serveur
startServer();

export default app;
