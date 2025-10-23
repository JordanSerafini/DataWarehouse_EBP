/**
 * Routes API pour les backups/dumps PostgreSQL
 */

import { Router, Request, Response } from 'express';
import BackupService from '../services/backup.service';

const router = Router();

/**
 * POST /api/backup/create
 * Créer un dump de la base de données PostgreSQL
 * Body: {
 *   format?: 'plain' | 'custom' | 'directory' | 'tar', // Format du backup
 *   compress?: boolean,     // Compression (pour format custom)
 *   tables?: string[],      // Tables spécifiques (optionnel, toutes par défaut)
 *   schemaOnly?: boolean,   // Sauvegarder uniquement le schéma
 *   dataOnly?: boolean,     // Sauvegarder uniquement les données
 *   forceOS?: 'windows' | 'linux' // Forcer le système d'exploitation (auto-détection par défaut)
 * }
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    console.log('\n========== API: Création de backup ==========');
    console.log('Paramètres reçus:', JSON.stringify(req.body, null, 2));

    const {
      format = 'plain',
      compress = true,
      tables,
      schemaOnly = false,
      dataOnly = false,
      forceOS,
    } = req.body;

    // Validation
    const validFormats = ['plain', 'custom', 'directory', 'tar'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        error: `Le format doit être l'un de: ${validFormats.join(', ')}`,
      });
    }

    if (tables && !Array.isArray(tables)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "tables" doit être un tableau de chaînes',
      });
    }

    if (schemaOnly && dataOnly) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas spécifier à la fois "schemaOnly" et "dataOnly"',
      });
    }

    if (forceOS && !['windows', 'linux'].includes(forceOS)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "forceOS" doit être "windows" ou "linux"',
      });
    }

    // Créer le backup
    const result = await BackupService.createBackup({
      format,
      compress,
      tables,
      schemaOnly,
      dataOnly,
      forceOS,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Backup créé avec succès',
        filePath: result.filePath,
        size: result.size,
        sizeInMB: result.size ? (result.size / (1024 * 1024)).toFixed(2) : undefined,
        duration: result.duration,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création du backup:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/backup/list
 * Liste tous les backups existants
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    console.log('\n========== API: Liste des backups ==========');

    const backups = BackupService.listBackups();

    // Formater les résultats
    const formattedBackups = backups.map(backup => ({
      fileName: backup.fileName,
      size: backup.size,
      sizeInMB: (backup.size / (1024 * 1024)).toFixed(2),
      created: backup.created,
    }));

    return res.status(200).json({
      success: true,
      count: backups.length,
      backupDir: BackupService.getBackupDir(),
      backups: formattedBackups,
    });
  } catch (error) {
    console.error('Erreur lors de la liste des backups:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * DELETE /api/backup/:fileName
 * Supprime un backup spécifique
 */
router.delete('/:fileName', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;

    console.log(`\n========== API: Suppression du backup ${fileName} ==========`);

    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du fichier est requis',
      });
    }

    const success = BackupService.deleteBackup(fileName);

    if (success) {
      return res.status(200).json({
        success: true,
        message: `Backup "${fileName}" supprimé avec succès`,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: `Backup "${fileName}" non trouvé`,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du backup:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/backup/cleanup
 * Nettoie les anciens backups
 * Body: {
 *   keepCount?: number  // Nombre de backups à conserver (10 par défaut)
 * }
 */
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    const { keepCount = 10 } = req.body;

    console.log(`\n========== API: Nettoyage des backups (garder ${keepCount}) ==========`);

    if (typeof keepCount !== 'number' || keepCount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "keepCount" doit être un nombre positif',
      });
    }

    const deletedCount = BackupService.cleanupOldBackups(keepCount);

    return res.status(200).json({
      success: true,
      message: `${deletedCount} backup(s) ancien(s) supprimé(s)`,
      deletedCount,
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des backups:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;
