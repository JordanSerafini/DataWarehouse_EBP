/**
 * Service de sauvegarde (dump) de la base de données PostgreSQL
 * Utilise pg_dump pour créer des backups de la base de données
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

interface BackupOptions {
  format?: 'plain' | 'custom' | 'directory' | 'tar'; // Format du backup
  compress?: boolean; // Compression du backup
  tables?: string[]; // Tables spécifiques à sauvegarder (si vide, toute la base)
  schemaOnly?: boolean; // Sauvegarder uniquement le schéma
  dataOnly?: boolean; // Sauvegarder uniquement les données
  forceOS?: 'windows' | 'linux'; // Forcer le système d'exploitation (par défaut: détection auto)
}

interface BackupResult {
  success: boolean;
  filePath?: string;
  size?: number;
  duration: number;
  error?: string;
}

class BackupService {
  private backupDir: string;

  constructor() {
    // Créer le dossier de backup à la racine du projet
    this.backupDir = path.join(process.cwd(), 'backup');
    this.ensureBackupDirExists();
  }

  /**
   * Détecte le système d'exploitation
   */
  private detectOS(forceOS?: 'windows' | 'linux'): 'windows' | 'linux' {
    if (forceOS) {
      return forceOS;
    }
    // process.platform retourne 'win32' pour Windows, 'linux' pour Linux, 'darwin' pour macOS
    return process.platform === 'win32' ? 'windows' : 'linux';
  }

  /**
   * S'assure que le dossier de backup existe
   */
  private ensureBackupDirExists(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`Dossier de backup créé: ${this.backupDir}`);
    }
  }

  /**
   * Génère un nom de fichier pour le backup
   */
  private generateBackupFileName(format: string, tables?: string[]): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dbName = process.env.PG_DATABASE || 'sli_db';

    let fileName = `${dbName}_${timestamp}`;

    if (tables && tables.length > 0) {
      fileName += `_${tables.join('_')}`;
    }

    const extension = this.getFileExtension(format);
    return `${fileName}${extension}`;
  }

  /**
   * Obtient l'extension de fichier selon le format
   */
  private getFileExtension(format: string): string {
    switch (format) {
      case 'plain':
        return '.sql';
      case 'custom':
        return '.dump';
      case 'directory':
        return ''; // Pas d'extension pour le format directory
      case 'tar':
        return '.tar';
      default:
        return '.sql';
    }
  }

  /**
   * Construit la commande pg_dump adaptée au système d'exploitation
   */
  private buildPgDumpCommand(filePath: string, options: BackupOptions = {}): string {
    const {
      format = 'plain',
      compress = true,
      tables = [],
      schemaOnly = false,
      dataOnly = false,
      forceOS,
    } = options;

    const host = process.env.PG_HOST || 'localhost';
    const port = process.env.PG_PORT || '5432';
    const user = process.env.PG_USER || 'postgres';
    const database = process.env.PG_DATABASE || 'sli_db';
    const password = process.env.PG_PASSWORD || 'postgres';

    // Détecter le système d'exploitation
    const os = this.detectOS(forceOS);

    // Construire la commande de base
    let command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database}`;

    // Ajouter le format
    if (format !== 'plain') {
      command += ` -F ${format.charAt(0)}`;
    }

    // Ajouter la compression pour le format custom
    if (compress && format === 'custom') {
      command += ' -Z 9';
    }

    // Options schéma/données
    if (schemaOnly) {
      command += ' --schema-only';
    } else if (dataOnly) {
      command += ' --data-only';
    }

    // Ajouter les tables spécifiques
    if (tables.length > 0) {
      tables.forEach(table => {
        command += ` -t "${table}"`;
      });
    }

    // Ajouter le fichier de sortie
    if (format !== 'directory') {
      command += ` -f "${filePath}"`;
    } else {
      command += ` -f "${filePath}"`;
    }

    // Ajouter le mot de passe via variable d'environnement selon l'OS
    if (os === 'windows') {
      // Sur Windows, utiliser set PGPASSWORD=xxx && commande
      command = `set PGPASSWORD=${password} && ${command}`;
    } else {
      // Sur Linux/Mac, utiliser PGPASSWORD=xxx commande
      command = `PGPASSWORD=${password} ${command}`;
    }

    return command;
  }

  /**
   * Crée un backup de la base de données PostgreSQL
   */
  async createBackup(options: BackupOptions = {}): Promise<BackupResult> {
    const startTime = Date.now();

    try {
      console.log('\n=== Création du backup PostgreSQL ===');

      const format = options.format || 'plain';
      const fileName = this.generateBackupFileName(format, options.tables);
      const filePath = path.join(this.backupDir, fileName);

      console.log(`Format: ${format}`);
      console.log(`Fichier: ${fileName}`);

      if (options.tables && options.tables.length > 0) {
        console.log(`Tables: ${options.tables.join(', ')}`);
      } else {
        console.log(`Tables: Toutes les tables`);
      }

      // Construire et exécuter la commande pg_dump
      const command = this.buildPgDumpCommand(filePath, options);

      console.log('Exécution du backup...');

      // Masquer le mot de passe dans les logs
      const commandForLog = command.replace(/PGPASSWORD=\S+/, 'PGPASSWORD=***');
      console.log(`Commande: ${commandForLog}`);

      await execAsync(command);

      // Vérifier que le fichier a été créé
      if (!fs.existsSync(filePath)) {
        throw new Error(`Le fichier de backup n'a pas été créé: ${filePath}`);
      }

      // Obtenir la taille du fichier
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      const duration = Date.now() - startTime;

      console.log(`✓ Backup créé avec succès`);
      console.log(`  Chemin: ${filePath}`);
      console.log(`  Taille: ${sizeInMB} MB`);
      console.log(`  Durée: ${(duration / 1000).toFixed(2)}s`);

      return {
        success: true,
        filePath,
        size: stats.size,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = (error as Error).message;

      console.error('✗ Erreur lors de la création du backup:', errorMessage);

      // Vérifier si pg_dump est installé
      if (errorMessage.includes('pg_dump') && errorMessage.includes('not found')) {
        return {
          success: false,
          duration,
          error: 'pg_dump n\'est pas installé ou n\'est pas dans le PATH. Veuillez installer PostgreSQL client tools.',
        };
      }

      return {
        success: false,
        duration,
        error: errorMessage,
      };
    }
  }

  /**
   * Liste tous les backups existants
   */
  listBackups(): { fileName: string; size: number; created: Date }[] {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }

    const files = fs.readdirSync(this.backupDir);
    const backups = files
      .filter(file => {
        return file.endsWith('.sql') ||
               file.endsWith('.dump') ||
               file.endsWith('.tar');
      })
      .map(file => {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          size: stats.size,
          created: stats.birthtime,
        };
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime());

    return backups;
  }

  /**
   * Supprime un backup
   */
  deleteBackup(fileName: string): boolean {
    const filePath = path.join(this.backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`Le fichier de backup n'existe pas: ${fileName}`);
      return false;
    }

    try {
      fs.unlinkSync(filePath);
      console.log(`Backup supprimé: ${fileName}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du backup:`, error);
      return false;
    }
  }

  /**
   * Nettoie les anciens backups (garde seulement les N plus récents)
   */
  cleanupOldBackups(keepCount: number = 10): number {
    const backups = this.listBackups();

    if (backups.length <= keepCount) {
      console.log(`Aucun backup à nettoyer (${backups.length} backups, limite: ${keepCount})`);
      return 0;
    }

    const toDelete = backups.slice(keepCount);
    let deletedCount = 0;

    for (const backup of toDelete) {
      if (this.deleteBackup(backup.fileName)) {
        deletedCount++;
      }
    }

    console.log(`${deletedCount} backup(s) ancien(s) supprimé(s)`);
    return deletedCount;
  }

  /**
   * Obtient le chemin du dossier de backup
   */
  getBackupDir(): string {
    return this.backupDir;
  }
}

export default new BackupService();
export { BackupOptions, BackupResult };
