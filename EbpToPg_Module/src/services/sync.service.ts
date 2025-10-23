/**
 * Service de synchronisation EBP (MSSQL) vers PostgreSQL
 * Gère la synchronisation complète et incrémentale des tables
 * Respecte la casse et les noms de colonnes spécifiques (ex: caption, customer.Id)
 */

import EBPClient from '../../clients/ebp.clients';
import DatabaseService from './database.service';
import TypeMapperService, { ColumnDefinition } from './type-mapper.service';
import pgFormat from 'pg-format';

interface TableMetadata {
  tableName: string;
  columns: ColumnDefinition[];
  primaryKeys: string[];
  rowCount: number;
}

interface SyncResult {
  tableName: string;
  status: 'success' | 'error';
  rowsSynced: number;
  duration: number;
  error?: string;
}

interface SyncOptions {
  tables?: string[]; // Tables spécifiques à synchroniser (si vide, toutes les tables)
  dropAndCreate?: boolean; // Si true, DROP TABLE + CREATE, sinon TRUNCATE + INSERT
  batchSize?: number; // Nombre de lignes à insérer par batch
  schema?: string; // Schéma MSSQL source (par défaut 'dbo')
}

class SyncService {
  private batchSize = 1000; // Taille par défaut des batchs

  /**
   * Récupère les métadonnées d'une table MSSQL incluant les clés primaires
   */
  async getTableMetadata(tableName: string, schema: string = 'dbo'): Promise<TableMetadata> {
    console.log(`Récupération des métadonnées de la table ${schema}.${tableName}...`);

    // Récupérer les informations sur les colonnes
    const columnsQuery = TypeMapperService.getTableSchemaQuery(tableName, schema);
    const columnsResult = await EBPClient.query(columnsQuery);

    if (!columnsResult.recordset || columnsResult.recordset.length === 0) {
      throw new Error(`Table "${tableName}" non trouvée dans le schéma "${schema}"`);
    }

    const columns: ColumnDefinition[] = columnsResult.recordset.map((col: any) => ({
      columnName: col.columnName,
      dataType: col.dataType,
      maxLength: col.maxLength,
      precision: col.precision,
      scale: col.scale,
      isNullable: Boolean(col.isNullable),
    }));

    // Récupérer les clés primaires
    const primaryKeys: string[] = columnsResult.recordset
      .filter((col: any) => col.isPrimaryKey)
      .map((col: any) => col.columnName);

    // Compter les lignes
    const countResult = await EBPClient.query(`SELECT COUNT(*) as count FROM [${schema}].[${tableName}]`);
    const rowCount = countResult.recordset[0].count;

    console.log(`Table ${tableName}: ${columns.length} colonnes, ${primaryKeys.length} clés primaires, ${rowCount} lignes`);

    return {
      tableName,
      columns,
      primaryKeys,
      rowCount,
    };
  }

  /**
   * Liste toutes les tables disponibles dans EBP
   */
  async listEBPTables(schema: string = 'dbo'): Promise<string[]> {
    const query = TypeMapperService.getTablesListQuery(schema);
    const result = await EBPClient.query(query);
    return result.recordset.map((row: any) => row.tableName);
  }

  /**
   * Crée une table PostgreSQL basée sur le schéma MSSQL
   * Respecte les noms de colonnes avec leur casse (ex: customer.Id, caption)
   */
  async createTableInPG(metadata: TableMetadata): Promise<void> {
    const { tableName, columns, primaryKeys } = metadata;

    console.log(`Création de la table "${tableName}" dans PostgreSQL...`);

    // Générer les définitions de colonnes en respectant la casse
    const columnDefinitions = columns.map(col =>
      TypeMapperService.generateColumnDefinition(col)
    );

    // Ajouter la contrainte de clé primaire si elle existe
    let createTableSQL = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  ${columnDefinitions.join(',\n  ')}`;

    if (primaryKeys.length > 0) {
      const pkColumns = primaryKeys.map(pk => `"${pk}"`).join(', ');
      createTableSQL += `,\n  PRIMARY KEY (${pkColumns})`;
    }

    createTableSQL += '\n)';

    await DatabaseService.query(createTableSQL);
    console.log(`Table "${tableName}" créée avec succès.`);
  }

  /**
   * Récupère les données d'une table MSSQL avec pagination
   */
  async fetchDataFromEBP(
    tableName: string,
    columns: ColumnDefinition[],
    offset: number = 0,
    limit: number = 1000,
    schema: string = 'dbo'
  ): Promise<any[]> {
    // Construire la liste des colonnes en respectant la casse avec des crochets MSSQL
    const columnNames = columns.map(col => `[${col.columnName}]`).join(', ');

    const query = `
      SELECT ${columnNames}
      FROM [${schema}].[${tableName}]
      ORDER BY (SELECT NULL)
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const result = await EBPClient.query(query);
    return result.recordset || [];
  }

  /**
   * Insère des données dans PostgreSQL par batch
   * Utilise pg-format pour l'échappement sécurisé et respecte la casse des colonnes
   */
  async insertDataToPG(
    tableName: string,
    columns: ColumnDefinition[],
    rows: any[]
  ): Promise<void> {
    if (rows.length === 0) return;

    // Noms de colonnes entre guillemets pour respecter la casse
    const columnNames = columns.map(col => `"${col.columnName}"`);

    // Convertir les valeurs selon leur type avec validation
    const values = rows.map(row => {
      return columns.map(col => {
        let value = row[col.columnName];

        // Convertir la valeur
        value = TypeMapperService.convertValue(value, col.dataType);

        // Validation pour éviter les "Invalid string length"
        if (typeof value === 'string') {
          // PostgreSQL limite les strings à environ 1GB, mais on limite à 10MB pour la sécurité
          const maxStringLength = 10 * 1024 * 1024; // 10 MB
          if (value.length > maxStringLength) {
            console.warn(`⚠️ Valeur tronquée dans ${tableName}.${col.columnName}: ${value.length} caractères > ${maxStringLength}`);
            value = value.substring(0, maxStringLength) + '... [TRONQUÉ]';
          }
        }

        return value;
      });
    });

    try {
      // Construire la requête INSERT avec pg-format pour éviter les injections SQL
      const insertQuery = pgFormat(
        `INSERT INTO "${tableName}" (${columnNames.join(', ')}) VALUES %L`,
        values
      );

      await DatabaseService.query(insertQuery);
    } catch (error) {
      // Si l'insertion échoue, essayer ligne par ligne pour identifier les problèmes
      console.error(`Erreur lors de l'insertion batch pour ${tableName}, tentative ligne par ligne...`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < values.length; i++) {
        try {
          const singleInsertQuery = pgFormat(
            `INSERT INTO "${tableName}" (${columnNames.join(', ')}) VALUES %L`,
            [values[i]]
          );
          await DatabaseService.query(singleInsertQuery);
          successCount++;
        } catch (rowError) {
          errorCount++;
          if (errorCount <= 5) { // Limiter les logs d'erreur
            console.error(`  ❌ Ligne ${i + 1}: ${(rowError as Error).message}`);
          }
        }
      }

      console.log(`  Résultat: ${successCount} lignes insérées, ${errorCount} échecs`);

      if (errorCount === values.length) {
        // Si toutes les lignes ont échoué, remonter l'erreur
        throw error;
      }
    }
  }

  /**
   * Synchronise une table complète d'EBP vers PostgreSQL
   */
  async syncTable(
    tableName: string,
    options: SyncOptions = {}
  ): Promise<SyncResult> {
    const startTime = Date.now();
    const schema = options.schema || 'dbo';
    const batchSize = options.batchSize || this.batchSize;

    try {
      console.log(`\n=== Synchronisation de la table "${tableName}" ===`);

      // 1. Récupérer les métadonnées de la table
      const metadata = await this.getTableMetadata(tableName, schema);

      // 2. Vérifier si la table existe dans PostgreSQL
      const tableExists = await DatabaseService.tableExists(tableName);

      if (options.dropAndCreate && tableExists) {
        console.log(`Suppression de la table "${tableName}"...`);
        await DatabaseService.dropTable(tableName, true);
      }

      // 3. Créer ou vider la table
      if (!tableExists || options.dropAndCreate) {
        await this.createTableInPG(metadata);
      } else {
        console.log(`Vidage de la table "${tableName}"...`);
        await DatabaseService.truncateTable(tableName, true);
      }

      // 4. Synchroniser les données par batch
      let offset = 0;
      let totalSynced = 0;

      while (offset < metadata.rowCount) {
        const rows = await this.fetchDataFromEBP(
          tableName,
          metadata.columns,
          offset,
          batchSize,
          schema
        );

        if (rows.length === 0) break;

        await this.insertDataToPG(tableName, metadata.columns, rows);

        totalSynced += rows.length;
        offset += batchSize;

        const progress = Math.min(100, (totalSynced / metadata.rowCount) * 100).toFixed(1);
        console.log(`  Progression: ${totalSynced}/${metadata.rowCount} (${progress}%)`);
      }

      const duration = Date.now() - startTime;
      console.log(`✓ Table "${tableName}" synchronisée: ${totalSynced} lignes en ${duration}ms`);

      return {
        tableName,
        status: 'success',
        rowsSynced: totalSynced,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = (error as Error).message;
      const errorStack = (error as Error).stack;

      console.error(`✗ Erreur lors de la synchronisation de "${tableName}":`, errorMessage);
      console.error(`  Stack:`, errorStack);

      // Améliorer le message d'erreur selon le type
      let friendlyError = errorMessage;

      if (errorMessage.includes('Invalid string length')) {
        friendlyError = 'Données texte trop volumineuses (certains champs dépassent 10MB)';
      } else if (errorMessage.includes('numeric field overflow')) {
        friendlyError = 'Valeur numérique hors limites (vérifiez les champs DECIMAL/NUMERIC)';
      } else if (errorMessage.includes('value too long')) {
        friendlyError = 'Valeur trop longue pour le type de colonne défini';
      } else if (errorMessage.includes('invalid input syntax')) {
        friendlyError = 'Format de données invalide (problème de conversion de type)';
      }

      return {
        tableName,
        status: 'error',
        rowsSynced: 0,
        duration,
        error: friendlyError,
      };
    }
  }

  /**
   * Synchronise plusieurs tables ou toutes les tables
   */
  async syncMultipleTables(options: SyncOptions = {}): Promise<SyncResult[]> {
    console.log('\n========================================');
    console.log('DÉBUT DE LA SYNCHRONISATION COMPLÈTE');
    console.log('========================================\n');

    const startTime = Date.now();

    // Déterminer quelles tables synchroniser
    let tablesToSync: string[];

    if (options.tables && options.tables.length > 0) {
      tablesToSync = options.tables;
      console.log(`Tables sélectionnées: ${tablesToSync.join(', ')}`);
    } else {
      console.log('Récupération de la liste de toutes les tables...');
      tablesToSync = await this.listEBPTables(options.schema);
      console.log(`${tablesToSync.length} tables trouvées: ${tablesToSync.join(', ')}`);
    }

    // Synchroniser chaque table
    const results: SyncResult[] = [];

    for (const tableName of tablesToSync) {
      const result = await this.syncTable(tableName, options);
      results.push(result);
    }

    // Résumé
    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const totalRows = results.reduce((sum, r) => sum + r.rowsSynced, 0);

    console.log('\n========================================');
    console.log('RÉSUMÉ DE LA SYNCHRONISATION');
    console.log('========================================');
    console.log(`Total tables: ${results.length}`);
    console.log(`Succès: ${successCount}`);
    console.log(`Erreurs: ${errorCount}`);
    console.log(`Total lignes synchronisées: ${totalRows}`);
    console.log(`Durée totale: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log('========================================\n');

    return results;
  }
}

export default new SyncService();
export { SyncOptions, SyncResult, TableMetadata };
