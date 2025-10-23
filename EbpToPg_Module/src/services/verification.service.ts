/**
 * Service de vérification de synchronisation
 * Compare les données entre EBP (MSSQL) et PostgreSQL
 * Détecte les différences et génère des rapports de vérification
 */

import EBPClient from '../../clients/ebp.clients';
import DatabaseService from './database.service';
import SyncService, { TableMetadata } from './sync.service';

// Colonnes système à exclure de la vérification (auto-générées, non pertinentes)
const EXCLUDED_COLUMNS = [
  'sysCreatedDate',
  'sysCreatedUser',
  'sysModifiedDate',
  'sysModifiedUser',
  'sysEditCounter',
  'sysRecordVersion',
  'sysRecordVersionId',
  'Id', // ID interne auto-généré
  'CreatedByDocumentId',
  'CreatedByExecutionQuote',
  'CreatedBySoftware',
  'CreatedBySystem',
  'CreatedFromConstructionSiteConsumptions',
  'CreatedMaintenanceContractId',
  'IsCostAmountModifiedByNextDocument',
  'IsModified',
  'ModifiedObjectId',
  'ModifiedSinceRecovery',
  'NextScheduledItemPriceUpdateDate',
  'PriceModifiedDate',
  'QuantityUserModified',
  'ReportModifiedDate',
  'SalePriceModifiedDate',
  'SalePriceModifiedUserId',
  'ScheduledUpdateDate',
  'SynchronizationDate',
  'SynchronizationUniqueId',
  'isCreated',
  'lastSynchroDate',
];

interface VerificationResult {
  tableName: string;
  status: 'ok' | 'warning' | 'error';
  ebpRowCount: number;
  pgRowCount: number;
  rowCountMatch: boolean;
  samplesChecked: number;
  samplesMatched: number;
  samplesMismatched: number;
  missingInPG: number;
  missingInEBP: number;
  dataIntegrityIssues: DataIssue[];
  duration: number;
  error?: string;
}

interface DataIssue {
  primaryKey: { [key: string]: any };
  column: string;
  ebpValue: any;
  pgValue: any;
  description: string;
}

interface VerificationOptions {
  tables?: string[]; // Tables à vérifier (si vide, toutes les tables)
  sampleSize?: number; // Nombre de lignes à vérifier en détail (0 = toutes)
  checkAllRows?: boolean; // Si true, vérifie toutes les lignes
  schema?: string; // Schéma MSSQL source
}

interface RepairPlan {
  tableName: string;
  action: 'full-sync' | 'partial-sync' | 'none';
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

class VerificationService {
  /**
   * Tronque un nom de colonne à 63 caractères (limite PostgreSQL)
   */
  private truncateColumnName(columnName: string): string {
    return columnName.length > 63 ? columnName.substring(0, 63) : columnName;
  }

  /**
   * Vérifie le nombre de lignes entre EBP et PostgreSQL
   */
  async verifyRowCount(tableName: string, schema: string = 'dbo'): Promise<{
    ebpCount: number;
    pgCount: number;
    match: boolean;
  }> {
    // Compter dans EBP
    const ebpResult = await EBPClient.query(
      `SELECT COUNT(*) as count FROM [${schema}].[${tableName}]`
    );
    const ebpCount = ebpResult.recordset[0].count;

    // Compter dans PostgreSQL
    const pgCount = await DatabaseService.countRows(tableName);

    return {
      ebpCount,
      pgCount,
      match: ebpCount === pgCount,
    };
  }

  /**
   * Récupère un échantillon de données d'EBP pour vérification
   * Utilise les clés primaires pour une comparaison fiable
   */
  async fetchSampleFromEBP(
    tableName: string,
    metadata: TableMetadata,
    limit: number = 100,
    schema: string = 'dbo'
  ): Promise<any[]> {
    const columnNames = metadata.columns.map(col => `[${col.columnName}]`).join(', ');

    // Prendre un échantillon stratifié (début, milieu, fin)
    const query = limit > 0
      ? `SELECT TOP ${limit} ${columnNames} FROM [${schema}].[${tableName}] ORDER BY (SELECT NULL)`
      : `SELECT ${columnNames} FROM [${schema}].[${tableName}]`;

    const result = await EBPClient.query(query);
    return result.recordset || [];
  }

  /**
   * Récupère les données correspondantes dans PostgreSQL
   * Utilise les clés primaires pour la correspondance exacte
   */
  async fetchCorrespondingFromPG(
    tableName: string,
    primaryKeys: string[],
    ebpRows: any[],
    metadata?: TableMetadata
  ): Promise<Map<string, any>> {
    if (ebpRows.length === 0 || primaryKeys.length === 0) {
      return new Map();
    }

    // Récupérer toutes les lignes correspondantes en une seule requête
    const pgRows = new Map<string, any>();

    for (const ebpRow of ebpRows) {
      // Construire la condition WHERE basée sur les clés primaires
      // PostgreSQL tronque les noms de colonnes à 63 caractères
      const whereConditions = primaryKeys.map((pk, idx) => {
        const truncatedPk = this.truncateColumnName(pk);
        return `"${truncatedPk}" = $${idx + 1}`;
      }).join(' AND ');

      const pkValues = primaryKeys.map(pk => ebpRow[pk]);

      // Si on a les métadonnées, on peut sélectionner les colonnes explicitement avec les quotes
      // pour préserver la casse, sinon utiliser SELECT *
      // IMPORTANT: PostgreSQL tronque les noms de colonnes à 63 caractères
      let selectClause = '*';
      if (metadata) {
        selectClause = metadata.columns.map(col => {
          const truncatedName = this.truncateColumnName(col.columnName);
          // Utiliser un alias avec le nom tronqué pour que la clé du résultat soit cohérente
          return `"${truncatedName}" AS "${truncatedName}"`;
        }).join(', ');
      }

      const result = await DatabaseService.query(
        `SELECT ${selectClause} FROM "${tableName}" WHERE ${whereConditions}`,
        pkValues
      );

      if (result.rows.length > 0) {
        // Créer une clé unique basée sur les clés primaires
        const key = primaryKeys.map(pk => String(ebpRow[pk])).join('|');
        pgRows.set(key, result.rows[0]);
      }
    }

    return pgRows;
  }

  /**
   * Compare deux valeurs en tenant compte des types et des conversions
   */
  compareValues(val1: any, val2: any, dataType: string): boolean {
    // Gérer les valeurs nulles
    if (val1 === null && val2 === null) return true;
    if (val1 === null || val2 === null) return false;

    // Gérer les undefined
    if (val1 === undefined && val2 === undefined) return true;
    if (val1 === undefined || val2 === undefined) return false;

    const type = dataType.toLowerCase();

    // Comparaison des dates avec tolérance pour timezone et précision
    if (type.includes('date') || type.includes('time')) {
      try {
        const date1 = new Date(val1);
        const date2 = new Date(val2);

        // Vérifier que les dates sont valides
        if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
          return String(val1) === String(val2);
        }

        // Tolérance de 3 heures (pour gérer les différences de timezone + DST)
        // MSSQL peut stocker en heure locale alors que PostgreSQL en UTC
        const diffMs = Math.abs(date1.getTime() - date2.getTime());
        const toleranceMs = 3 * 60 * 60 * 1000; // 3 heures = 10800000 ms

        return diffMs < toleranceMs;
      } catch (e) {
        // Si erreur de parsing, comparer comme strings
        return String(val1).trim() === String(val2).trim();
      }
    }

    // Comparaison des booléens
    if (type === 'bit' || type === 'boolean') {
      return Boolean(val1) === Boolean(val2);
    }

    // Comparaison des buffers
    if (Buffer.isBuffer(val1) && Buffer.isBuffer(val2)) {
      return val1.equals(val2);
    }

    // Comparaison des nombres (tous types numériques)
    // Vérifie si les deux valeurs peuvent être converties en nombres
    // Ceci gère le cas où PostgreSQL retourne des NUMERIC comme strings
    const isNumericType =
      type.includes('int') ||
      type.includes('decimal') ||
      type.includes('numeric') ||
      type.includes('money') ||
      type.includes('float') ||
      type.includes('real') ||
      type.includes('double');

    if (isNumericType) {
      try {
        // Convertir les deux valeurs en nombres
        const num1 = typeof val1 === 'number' ? val1 : parseFloat(String(val1));
        const num2 = typeof val2 === 'number' ? val2 : parseFloat(String(val2));

        if (isNaN(num1) || isNaN(num2)) {
          return false;
        }

        // Pour les entiers, comparer directement
        if (type.includes('int') && !type.includes('decimal')) {
          return num1 === num2;
        }

        // Pour les décimaux, utiliser une tolérance
        // Tolérance relative pour les grands nombres, absolue pour les petits
        if (Math.abs(num1) < 0.01 && Math.abs(num2) < 0.01) {
          return Math.abs(num1 - num2) < 0.0001; // Tolérance absolue
        }

        const relativeDiff = Math.abs((num1 - num2) / Math.max(Math.abs(num1), Math.abs(num2)));
        return relativeDiff < 0.0001; // 0.01% de tolérance
      } catch (e) {
        return String(val1) === String(val2);
      }
    }

    // Comparaison standard (strings) - trim et normalisation
    const str1 = String(val1).trim();
    const str2 = String(val2).trim();

    // Si les deux sont vides, considérer comme égaux
    if (str1 === '' && str2 === '') return true;

    // Pour les GUIDs/UUIDs (format UUID), comparer en ignorant la casse
    // Format: 8-4-4-4-12 caractères hexadécimaux
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(str1) && uuidPattern.test(str2)) {
      return str1.toLowerCase() === str2.toLowerCase();
    }

    // Comparaison standard
    return str1 === str2;
  }

  /**
   * Vérifie l'intégrité des données pour une table
   */
  async verifyTable(
    tableName: string,
    options: VerificationOptions = {}
  ): Promise<VerificationResult> {
    const startTime = Date.now();
    const schema = options.schema || 'dbo';

    try {
      console.log(`\n=== Vérification de la table "${tableName}" ===`);

      // 1. Vérifier que la table existe dans PostgreSQL
      const pgTableExists = await DatabaseService.tableExists(tableName);
      if (!pgTableExists) {
        return {
          tableName,
          status: 'error',
          ebpRowCount: 0,
          pgRowCount: 0,
          rowCountMatch: false,
          samplesChecked: 0,
          samplesMatched: 0,
          samplesMismatched: 0,
          missingInPG: 0,
          missingInEBP: 0,
          dataIntegrityIssues: [],
          duration: Date.now() - startTime,
          error: `La table "${tableName}" n'existe pas dans PostgreSQL`,
        };
      }

      // 2. Récupérer les métadonnées
      const metadata = await SyncService.getTableMetadata(tableName, schema);

      // 3. Vérifier le nombre de lignes
      const rowCountCheck = await this.verifyRowCount(tableName, schema);
      console.log(`  EBP: ${rowCountCheck.ebpCount} lignes`);
      console.log(`  PostgreSQL: ${rowCountCheck.pgCount} lignes`);
      console.log(`  Correspondance: ${rowCountCheck.match ? '✓' : '✗'}`);

      // 4. Vérifier un échantillon de données ou toutes les données
      const sampleSize = options.checkAllRows ? 0 : (options.sampleSize || 100);
      const ebpSample = await this.fetchSampleFromEBP(tableName, metadata, sampleSize, schema);

      console.log(`  Vérification de ${ebpSample.length} lignes...`);

      // 5. Comparer les données
      const dataIssues: DataIssue[] = [];
      let samplesMatched = 0;
      let samplesMismatched = 0;
      let missingInPG = 0;

      if (metadata.primaryKeys.length > 0) {
        const pgData = await this.fetchCorrespondingFromPG(tableName, metadata.primaryKeys, ebpSample, metadata);

        for (const ebpRow of ebpSample) {
          const pkKey = metadata.primaryKeys.map(pk => String(ebpRow[pk])).join('|');
          const pgRow = pgData.get(pkKey);

          if (!pgRow) {
            missingInPG++;
            const pkObject: { [key: string]: any } = {};
            metadata.primaryKeys.forEach(pk => {
              pkObject[pk] = ebpRow[pk];
            });
            dataIssues.push({
              primaryKey: pkObject,
              column: 'ALL',
              ebpValue: 'EXISTS',
              pgValue: 'MISSING',
              description: 'Ligne présente dans EBP mais absente dans PostgreSQL',
            });
            samplesMismatched++;
            continue;
          }

          // Comparer chaque colonne (sauf les colonnes système)
          let rowHasIssue = false;

          for (const col of metadata.columns) {
            // Ignorer les colonnes système/techniques
            if (EXCLUDED_COLUMNS.includes(col.columnName)) {
              continue;
            }

            const ebpValue = ebpRow[col.columnName];
            // Utiliser le nom tronqué pour accéder à la valeur PG
            const truncatedColName = this.truncateColumnName(col.columnName);
            const pgValue = pgRow[truncatedColName];

            if (!this.compareValues(ebpValue, pgValue, col.dataType)) {
              rowHasIssue = true;
              const pkObject: { [key: string]: any } = {};
              metadata.primaryKeys.forEach(pk => {
                pkObject[pk] = ebpRow[pk];
              });
              dataIssues.push({
                primaryKey: pkObject,
                column: col.columnName,
                ebpValue,
                pgValue,
                description: `Valeur différente pour la colonne "${col.columnName}"`,
              });
            }
          }

          if (rowHasIssue) {
            samplesMismatched++;
          } else {
            samplesMatched++;
          }
        }
      } else {
        console.warn(`  ⚠ Pas de clé primaire définie, vérification limitée`);
      }

      // 6. Déterminer le statut
      let status: 'ok' | 'warning' | 'error' = 'ok';
      if (dataIssues.length > 0 || !rowCountCheck.match) {
        status = dataIssues.length > ebpSample.length * 0.1 ? 'error' : 'warning';
      }

      const duration = Date.now() - startTime;

      const result: VerificationResult = {
        tableName,
        status,
        ebpRowCount: rowCountCheck.ebpCount,
        pgRowCount: rowCountCheck.pgCount,
        rowCountMatch: rowCountCheck.match,
        samplesChecked: ebpSample.length,
        samplesMatched,
        samplesMismatched,
        missingInPG,
        missingInEBP: 0, // TODO: implémenter si nécessaire
        dataIntegrityIssues: dataIssues.slice(0, 50), // Limiter à 50 exemples
        duration,
      };

      console.log(`  Statut: ${status === 'ok' ? '✓ OK' : status === 'warning' ? '⚠ AVERTISSEMENT' : '✗ ERREUR'}`);
      console.log(`  Échantillons correspondants: ${samplesMatched}/${ebpSample.length}`);
      if (dataIssues.length > 0) {
        console.log(`  Problèmes détectés: ${dataIssues.length} (affichage limité à 50)`);
      }

      return result;
    } catch (error) {
      console.error(`✗ Erreur lors de la vérification de "${tableName}":`, error);
      return {
        tableName,
        status: 'error',
        ebpRowCount: 0,
        pgRowCount: 0,
        rowCountMatch: false,
        samplesChecked: 0,
        samplesMatched: 0,
        samplesMismatched: 0,
        missingInPG: 0,
        missingInEBP: 0,
        dataIntegrityIssues: [],
        duration: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Vérifie plusieurs tables ou toutes les tables
   */
  async verifyMultipleTables(options: VerificationOptions = {}): Promise<VerificationResult[]> {
    console.log('\n========================================');
    console.log('DÉBUT DE LA VÉRIFICATION');
    console.log('========================================\n');

    const startTime = Date.now();

    // Déterminer quelles tables vérifier
    let tablesToVerify: string[];

    if (options.tables && options.tables.length > 0) {
      tablesToVerify = options.tables;
      console.log(`Tables sélectionnées: ${tablesToVerify.join(', ')}`);
    } else {
      // Vérifier les tables qui existent dans PostgreSQL
      tablesToVerify = await DatabaseService.listTables();
      console.log(`${tablesToVerify.length} tables trouvées dans PostgreSQL`);
    }

    // Vérifier chaque table
    const results: VerificationResult[] = [];

    for (const tableName of tablesToVerify) {
      const result = await this.verifyTable(tableName, options);
      results.push(result);
    }

    // Résumé
    const totalDuration = Date.now() - startTime;
    const okCount = results.filter(r => r.status === 'ok').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log('\n========================================');
    console.log('RÉSUMÉ DE LA VÉRIFICATION');
    console.log('========================================');
    console.log(`Total tables vérifiées: ${results.length}`);
    console.log(`✓ OK: ${okCount}`);
    console.log(`⚠ Avertissements: ${warningCount}`);
    console.log(`✗ Erreurs: ${errorCount}`);
    console.log(`Durée totale: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log('========================================\n');

    return results;
  }

  /**
   * Génère un plan de réparation basé sur les résultats de vérification
   */
  generateRepairPlan(verificationResults: VerificationResult[]): RepairPlan[] {
    const repairPlan: RepairPlan[] = [];

    for (const result of verificationResults) {
      if (result.status === 'ok') {
        continue;
      }

      let action: 'full-sync' | 'partial-sync' | 'none' = 'none';
      let reason = '';
      let priority: 'high' | 'medium' | 'low' = 'low';

      // Décider de l'action en fonction des problèmes
      if (!result.rowCountMatch) {
        action = 'full-sync';
        reason = `Nombre de lignes différent (EBP: ${result.ebpRowCount}, PG: ${result.pgRowCount})`;
        priority = 'high';
      } else if (result.samplesMismatched > result.samplesMatched) {
        action = 'full-sync';
        reason = `Plus de 50% des échantillons ont des différences (${result.samplesMismatched}/${result.samplesChecked})`;
        priority = 'high';
      } else if (result.dataIntegrityIssues.length > 0) {
        action = 'partial-sync';
        reason = `${result.dataIntegrityIssues.length} problème(s) d'intégrité détecté(s)`;
        priority = 'medium';
      } else if (result.error) {
        action = 'full-sync';
        reason = `Erreur: ${result.error}`;
        priority = 'high';
      }

      if (action !== 'none') {
        repairPlan.push({
          tableName: result.tableName,
          action,
          reason,
          priority,
        });
      }
    }

    // Trier par priorité
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    repairPlan.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return repairPlan;
  }
}

export default new VerificationService();
export { VerificationResult, VerificationOptions, DataIssue, RepairPlan };
