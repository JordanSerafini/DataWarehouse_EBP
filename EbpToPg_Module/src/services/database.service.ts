/**
 * Service de gestion de la base de données PostgreSQL
 * Gère la création de la base de données et des connexions
 */

import { Client, Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
  private pool: Pool | null = null;

  /**
   * Vérifie si une base de données existe
   * @param dbName Nom de la base de données
   * @returns true si la base existe, false sinon
   */
  async databaseExists(dbName: string): Promise<boolean> {
    const client = new Client({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: 'postgres', // Connexion à la base par défaut
      password: process.env.PG_PASSWORD || 'postgres',
      port: parseInt(process.env.PG_PORT || '5432', 10),
    });

    try {
      await client.connect();
      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de la base de données:', error);
      throw error;
    } finally {
      await client.end();
    }
  }

  /**
   * Crée une base de données PostgreSQL si elle n'existe pas
   * @param dbName Nom de la base de données à créer
   */
  async createDatabaseIfNotExists(dbName: string): Promise<void> {
    const exists = await this.databaseExists(dbName);

    if (exists) {
      console.log(`La base de données "${dbName}" existe déjà.`);
      return;
    }

    const client = new Client({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      port: parseInt(process.env.PG_PORT || '5432', 10),
    });

    try {
      await client.connect();
      console.log(`Création de la base de données "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Base de données "${dbName}" créée avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la création de la base de données:', error);
      throw error;
    } finally {
      await client.end();
    }
  }

  /**
   * Initialise le pool de connexions PostgreSQL
   * @param createIfNotExists Si true, crée la base de données si elle n'existe pas
   */
  async initializePool(createIfNotExists: boolean = true): Promise<Pool> {
    const dbName = process.env.PG_DATABASE || 'sli_db';

    if (createIfNotExists) {
      await this.createDatabaseIfNotExists(dbName);
    }

    if (!this.pool) {
      this.pool = new Pool({
        user: process.env.PG_USER || 'postgres',
        host: process.env.PG_HOST || 'localhost',
        database: dbName,
        password: process.env.PG_PASSWORD || 'postgres',
        port: parseInt(process.env.PG_PORT || '5432', 10),
        max: 20, // Nombre maximum de clients dans le pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      this.pool.on('error', (err) => {
        console.error('Erreur inattendue du pool PostgreSQL:', err);
      });

      console.log(`Pool de connexions PostgreSQL initialisé pour "${dbName}".`);
    }

    return this.pool;
  }

  /**
   * Obtient le pool de connexions actuel
   * @returns Pool de connexions PostgreSQL
   */
  getPool(): Pool {
    if (!this.pool) {
      throw new Error('Le pool de connexions n\'est pas initialisé. Appelez initializePool() d\'abord.');
    }
    return this.pool;
  }

  /**
   * Exécute une requête SQL
   * @param query Requête SQL
   * @param params Paramètres de la requête
   * @returns Résultat de la requête
   */
  async query(query: string, params: any[] = []): Promise<any> {
    const pool = this.getPool();
    try {
      const result = await pool.query(query, params);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête:', error);
      console.error('Requête:', query);
      throw error;
    }
  }

  /**
   * Vérifie si une table existe
   * @param tableName Nom de la table
   * @param schema Schéma de la table (par défaut 'public')
   * @returns true si la table existe, false sinon
   */
  async tableExists(tableName: string, schema: string = 'public'): Promise<boolean> {
    const result = await this.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = $1
        AND table_name = $2
      )`,
      [schema, tableName]
    );
    return result.rows[0].exists;
  }

  /**
   * Liste toutes les tables de la base de données
   * @param schema Schéma de la base de données (par défaut 'public')
   * @returns Liste des noms de tables
   */
  async listTables(schema: string = 'public'): Promise<string[]> {
    const result = await this.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = $1
       AND table_type = 'BASE TABLE'
       ORDER BY table_name`,
      [schema]
    );
    return result.rows.map((row: any) => row.table_name);
  }

  /**
   * Supprime une table
   * @param tableName Nom de la table
   * @param cascade Si true, supprime également les dépendances
   */
  async dropTable(tableName: string, cascade: boolean = false): Promise<void> {
    const cascadeClause = cascade ? 'CASCADE' : '';
    await this.query(`DROP TABLE IF EXISTS "${tableName}" ${cascadeClause}`);
    console.log(`Table "${tableName}" supprimée.`);
  }

  /**
   * Vide une table (supprime toutes les lignes)
   * @param tableName Nom de la table
   * @param restart Si true, réinitialise les séquences
   */
  async truncateTable(tableName: string, restart: boolean = true): Promise<void> {
    const restartClause = restart ? 'RESTART IDENTITY' : '';
    await this.query(`TRUNCATE TABLE "${tableName}" ${restartClause} CASCADE`);
    console.log(`Table "${tableName}" vidée.`);
  }

  /**
   * Compte le nombre de lignes dans une table
   * @param tableName Nom de la table
   * @returns Nombre de lignes
   */
  async countRows(tableName: string): Promise<number> {
    const result = await this.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Obtient le schéma d'une table PostgreSQL
   * @param tableName Nom de la table
   * @param schema Schéma de la table (par défaut 'public')
   * @returns Liste des colonnes avec leurs propriétés
   */
  async getTableSchema(tableName: string, schema: string = 'public'): Promise<any[]> {
    const result = await this.query(
      `SELECT
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default
       FROM information_schema.columns
       WHERE table_schema = $1
       AND table_name = $2
       ORDER BY ordinal_position`,
      [schema, tableName]
    );
    return result.rows;
  }

  /**
   * Ferme le pool de connexions
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Pool de connexions PostgreSQL fermé.');
    }
  }
}

export default new DatabaseService();
