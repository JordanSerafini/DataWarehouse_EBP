/**
 * Service de mapping des types MSSQL vers PostgreSQL
 * Gère la conversion des types de données pour éviter toute perte d'information
 */

interface ColumnDefinition {
  columnName: string;
  dataType: string;
  maxLength: number | null;
  precision: number | null;
  scale: number | null;
  isNullable: boolean;
}

class TypeMapperService {
  /**
   * Mappe un type MSSQL vers son équivalent PostgreSQL
   * @param mssqlType Type MSSQL à mapper
   * @param maxLength Longueur maximale pour les types de texte
   * @param precision Précision pour les types numériques
   * @param scale Échelle pour les types numériques
   * @returns Type PostgreSQL équivalent
   */
  mapMSSQLToPG(
    mssqlType: string,
    maxLength: number | null = null,
    precision: number | null = null,
    scale: number | null = null
  ): string {
    const type = mssqlType.toLowerCase();

    // Types numériques
    if (type === 'bit') return 'BOOLEAN';
    if (type === 'tinyint') return 'SMALLINT';
    if (type === 'smallint') return 'SMALLINT';
    if (type === 'int') return 'INTEGER';
    if (type === 'bigint') return 'BIGINT';

    // Types décimaux/monétaires
    if (type === 'decimal' || type === 'numeric') {
      if (precision && scale !== null) {
        // PostgreSQL supporte jusqu'à 1000 de précision, mais en pratique on limite à 38 pour la compatibilité
        // On ajoute une marge de précision pour éviter les overflows avec des valeurs légèrement plus grandes
        // Par exemple, DECIMAL(28,8) peut avoir des valeurs avec 20 chiffres avant la virgule,
        // mais on utilise NUMERIC(38,8) pour avoir 30 chiffres avant la virgule et éviter les rejets
        const safePrecision = Math.min(Math.max(precision, 38), 38); // Toujours au moins 38, max 38
        const safeScale = Math.min(scale, safePrecision);
        return `NUMERIC(${safePrecision}, ${safeScale})`;
      }
      return 'NUMERIC(38, 10)'; // Valeur par défaut sécurisée
    }
    if (type === 'money') return 'NUMERIC(19, 4)';
    if (type === 'smallmoney') return 'NUMERIC(10, 4)';
    if (type === 'float') return 'DOUBLE PRECISION';
    if (type === 'real') return 'REAL';

    // Types caractères
    if (type === 'char') {
      return maxLength ? `CHAR(${maxLength})` : 'CHAR(1)';
    }
    if (type === 'varchar') {
      if (maxLength === -1) return 'TEXT'; // varchar(max)
      return maxLength ? `VARCHAR(${maxLength})` : 'VARCHAR(255)';
    }
    if (type === 'text') return 'TEXT';
    if (type === 'nchar') {
      return maxLength ? `CHAR(${maxLength})` : 'CHAR(1)';
    }
    if (type === 'nvarchar') {
      if (maxLength === -1) return 'TEXT'; // nvarchar(max)
      return maxLength ? `VARCHAR(${maxLength})` : 'VARCHAR(255)';
    }
    if (type === 'ntext') return 'TEXT';

    // Types date/heure
    if (type === 'date') return 'DATE';
    if (type === 'time') return 'TIME';
    if (type === 'datetime' || type === 'datetime2' || type === 'smalldatetime') {
      return 'TIMESTAMP';
    }
    if (type === 'datetimeoffset') return 'TIMESTAMP WITH TIME ZONE';

    // Types binaires
    if (type === 'binary') {
      return maxLength ? `BYTEA` : 'BYTEA';
    }
    if (type === 'varbinary') {
      return 'BYTEA';
    }
    if (type === 'image') return 'BYTEA';

    // Types spéciaux
    if (type === 'uniqueidentifier') return 'UUID';
    if (type === 'xml') return 'XML';
    if (type === 'sql_variant') return 'TEXT'; // Pas d'équivalent direct
    if (type === 'geography' || type === 'geometry') return 'TEXT'; // Nécessiterait PostGIS

    // Par défaut, utiliser TEXT pour éviter la perte de données
    console.warn(`Type MSSQL non mappé: ${mssqlType}, utilisation de TEXT par défaut`);
    return 'TEXT';
  }

  /**
   * Convertit une valeur MSSQL vers une valeur compatible PostgreSQL
   * @param value Valeur à convertir
   * @param mssqlType Type MSSQL de la valeur
   * @returns Valeur convertie pour PostgreSQL
   */
  convertValue(value: any, mssqlType: string): any {
    if (value === null || value === undefined) {
      return null;
    }

    const type = mssqlType.toLowerCase();

    // Conversion des bits en boolean
    if (type === 'bit') {
      return Boolean(value);
    }

    // Conversion des dates
    if (type === 'datetime' || type === 'datetime2' || type === 'smalldatetime' || type === 'date') {
      if (value instanceof Date) {
        return value;
      }
      return new Date(value);
    }

    // Conversion des uniqueidentifier en UUID
    if (type === 'uniqueidentifier') {
      return value.toString().toLowerCase();
    }

    // Conversion des buffers binaires
    if (type === 'binary' || type === 'varbinary' || type === 'image') {
      if (Buffer.isBuffer(value)) {
        return value;
      }
      return Buffer.from(value);
    }

    // Pour les autres types, retourner la valeur telle quelle
    return value;
  }

  /**
   * Génère la définition SQL d'une colonne PostgreSQL
   * @param column Définition de la colonne MSSQL
   * @returns Définition SQL PostgreSQL
   */
  generateColumnDefinition(column: ColumnDefinition): string {
    const pgType = this.mapMSSQLToPG(
      column.dataType,
      column.maxLength,
      column.precision,
      column.scale
    );

    const nullable = column.isNullable ? 'NULL' : 'NOT NULL';

    return `"${column.columnName}" ${pgType} ${nullable}`;
  }

  /**
   * Récupère le schéma complet d'une table MSSQL
   * @param tableName Nom de la table
   * @param schema Schéma de la table (par défaut 'dbo')
   * @returns Requête SQL pour récupérer les colonnes
   */
  getTableSchemaQuery(tableName: string, schema: string = 'dbo'): string {
    return `
      SELECT
        c.COLUMN_NAME as columnName,
        c.DATA_TYPE as dataType,
        c.CHARACTER_MAXIMUM_LENGTH as maxLength,
        c.NUMERIC_PRECISION as precision,
        c.NUMERIC_SCALE as scale,
        CASE WHEN c.IS_NULLABLE = 'YES' THEN 1 ELSE 0 END as isNullable,
        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END as isPrimaryKey
      FROM
        INFORMATION_SCHEMA.COLUMNS c
      LEFT JOIN (
        SELECT ku.TABLE_CATALOG, ku.TABLE_SCHEMA, ku.TABLE_NAME, ku.COLUMN_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
        INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS ku
          ON tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
          AND tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
      ) pk
      ON c.TABLE_CATALOG = pk.TABLE_CATALOG
        AND c.TABLE_SCHEMA = pk.TABLE_SCHEMA
        AND c.TABLE_NAME = pk.TABLE_NAME
        AND c.COLUMN_NAME = pk.COLUMN_NAME
      WHERE
        c.TABLE_NAME = '${tableName}'
        AND c.TABLE_SCHEMA = '${schema}'
      ORDER BY
        c.ORDINAL_POSITION
    `;
  }

  /**
   * Obtient la liste de toutes les tables d'un schéma
   * @param schema Schéma de la base de données (par défaut 'dbo')
   * @returns Requête SQL pour lister les tables
   */
  getTablesListQuery(schema: string = 'dbo'): string {
    return `
      SELECT
        TABLE_NAME as tableName,
        TABLE_SCHEMA as tableSchema
      FROM
        INFORMATION_SCHEMA.TABLES
      WHERE
        TABLE_TYPE = 'BASE TABLE'
        AND TABLE_SCHEMA = '${schema}'
      ORDER BY
        TABLE_NAME
    `;
  }
}

export default new TypeMapperService();
export { ColumnDefinition };
