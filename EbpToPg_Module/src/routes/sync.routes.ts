/**
 * Routes API pour la synchronisation EBP vers PostgreSQL
 */

import { Router, Request, Response } from 'express';
import SyncService from '../services/sync.service';
import VerificationService from '../services/verification.service';
import BackupService from '../services/backup.service';

const router = Router();

/**
 * POST /api/sync/full
 * Lancer une synchronisation complète (drop table + create ou truncate + insert)
 * Body: {
 *   tables?: string[],      // Tables à synchroniser (optionnel, toutes par défaut)
 *   dropAndCreate?: boolean, // true = DROP + CREATE, false = TRUNCATE + INSERT
 *   batchSize?: number,     // Taille des batchs (optionnel, 1000 par défaut)
 *   schema?: string         // Schéma MSSQL (optionnel, 'dbo' par défaut)
 * }
 */
router.post('/full', async (req: Request, res: Response) => {
  try {
    console.log('\n========== API: Synchronisation complète ==========');
    console.log('Paramètres reçus:', JSON.stringify(req.body, null, 2));

    const {
      tables,
      dropAndCreate = false,
      batchSize = 1000,
      schema = 'dbo',
    } = req.body;

    // Validation
    if (tables && !Array.isArray(tables)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "tables" doit être un tableau de chaînes',
      });
    }

    if (typeof dropAndCreate !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "dropAndCreate" doit être un booléen',
      });
    }

    // Lancer la synchronisation
    const results = await SyncService.syncMultipleTables({
      tables,
      dropAndCreate,
      batchSize,
      schema,
    });

    // Calculer les statistiques
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const totalRows = results.reduce((sum, r) => sum + r.rowsSynced, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return res.status(200).json({
      success: true,
      message: 'Synchronisation complète terminée',
      summary: {
        totalTables: results.length,
        success: successCount,
        errors: errorCount,
        totalRowsSynced: totalRows,
        totalDuration: totalDuration,
      },
      results,
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation complète:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/sync/verify
 * Vérifier la synchronisation entre EBP et PostgreSQL
 * Body: {
 *   tables?: string[],    // Tables à vérifier (optionnel, toutes par défaut)
 *   sampleSize?: number,  // Nombre de lignes à vérifier (0 = toutes)
 *   checkAllRows?: boolean, // Si true, vérifie toutes les lignes
 *   schema?: string       // Schéma MSSQL (optionnel, 'dbo' par défaut)
 * }
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    console.log('\n========== API: Vérification de la synchronisation ==========');
    console.log('Paramètres reçus:', JSON.stringify(req.body, null, 2));

    const {
      tables,
      sampleSize = 100,
      checkAllRows = false,
      schema = 'dbo',
    } = req.body;

    // Validation
    if (tables && !Array.isArray(tables)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "tables" doit être un tableau de chaînes',
      });
    }

    // Lancer la vérification
    const results = await VerificationService.verifyMultipleTables({
      tables,
      sampleSize,
      checkAllRows,
      schema,
    });

    // Calculer les statistiques
    const okCount = results.filter(r => r.status === 'ok').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const totalIssues = results.reduce((sum, r) => sum + r.dataIntegrityIssues.length, 0);

    return res.status(200).json({
      success: true,
      message: 'Vérification terminée',
      summary: {
        totalTables: results.length,
        ok: okCount,
        warnings: warningCount,
        errors: errorCount,
        totalIssues,
      },
      results,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/sync/repair
 * Réparer la synchronisation basée sur les résultats de vérification
 * Body: {
 *   verificationResults: VerificationResult[], // Résultats de vérification
 *   OR
 *   tables?: string[],    // Tables à resynchroniser
 *   dropAndCreate?: boolean,
 *   schema?: string
 * }
 */
router.post('/repair', async (req: Request, res: Response) => {
  try {
    console.log('\n========== API: Réparation de la synchronisation ==========');
    console.log('Paramètres reçus:', JSON.stringify(req.body, null, 2));

    const {
      verificationResults,
      tables,
      dropAndCreate = false,
      schema = 'dbo',
    } = req.body;

    let tablesToRepair: string[] = [];

    if (verificationResults && Array.isArray(verificationResults)) {
      // Générer un plan de réparation
      const repairPlan = VerificationService.generateRepairPlan(verificationResults);

      console.log('\n=== Plan de réparation ===');
      console.log(`${repairPlan.length} table(s) nécessitent une réparation`);

      repairPlan.forEach(plan => {
        console.log(`- ${plan.tableName}: ${plan.action} (priorité: ${plan.priority})`);
        console.log(`  Raison: ${plan.reason}`);
      });

      // Extraire les tables à réparer
      tablesToRepair = repairPlan
        .filter(plan => plan.action === 'full-sync' || plan.action === 'partial-sync')
        .map(plan => plan.tableName);
    } else if (tables && Array.isArray(tables)) {
      tablesToRepair = tables;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Vous devez fournir soit "verificationResults" soit "tables"',
      });
    }

    if (tablesToRepair.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucune table ne nécessite de réparation',
        summary: {
          totalTables: 0,
          success: 0,
          errors: 0,
        },
        results: [],
      });
    }

    console.log(`\nRéparation de ${tablesToRepair.length} table(s)...`);

    // Lancer la synchronisation des tables à réparer
    const results = await SyncService.syncMultipleTables({
      tables: tablesToRepair,
      dropAndCreate,
      schema,
    });

    // Calculer les statistiques
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const totalRows = results.reduce((sum, r) => sum + r.rowsSynced, 0);

    return res.status(200).json({
      success: true,
      message: 'Réparation terminée',
      summary: {
        totalTables: results.length,
        success: successCount,
        errors: errorCount,
        totalRowsSynced: totalRows,
      },
      results,
    });
  } catch (error) {
    console.error('Erreur lors de la réparation:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/sync/tables
 * Liste toutes les tables disponibles dans EBP
 * Query params: schema (optionnel, 'dbo' par défaut)
 */
router.get('/tables', async (req: Request, res: Response) => {
  try {
    const schema = (req.query.schema as string) || 'dbo';

    console.log(`\n========== API: Liste des tables (schéma: ${schema}) ==========`);

    const tables = await SyncService.listEBPTables(schema);

    return res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tables:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;
