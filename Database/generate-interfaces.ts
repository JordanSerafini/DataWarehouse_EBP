import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Mapping des types PostgreSQL vers TypeScript
const PG_TO_TS_TYPE_MAP: { [key: string]: string } = {
  // Numeric types
  'smallint': 'number',
  'integer': 'number',
  'bigint': 'number',
  'decimal': 'number',
  'numeric': 'number',
  'real': 'number',
  'double precision': 'number',
  'smallserial': 'number',
  'serial': 'number',
  'bigserial': 'number',
  'money': 'number',

  // String types
  'character varying': 'string',
  'varchar': 'string',
  'character': 'string',
  'char': 'string',
  'text': 'string',
  'citext': 'string',

  // Date/Time types
  'timestamp': 'Date',
  'timestamp without time zone': 'Date',
  'timestamp with time zone': 'Date',
  'date': 'Date',
  'time': 'string',
  'time without time zone': 'string',
  'time with time zone': 'string',
  'interval': 'string',

  // Boolean
  'boolean': 'boolean',

  // Binary
  'bytea': 'Buffer',

  // JSON
  'json': 'any',
  'jsonb': 'any',

  // UUID
  'uuid': 'string',

  // Network Address
  'inet': 'string',
  'cidr': 'string',
  'macaddr': 'string',

  // Geometric
  'point': 'string',
  'line': 'string',
  'lseg': 'string',
  'box': 'string',
  'path': 'string',
  'polygon': 'string',
  'circle': 'string',

  // Other
  'xml': 'string',
  'bit': 'string',
  'bit varying': 'string',
};

interface ColumnInfo {
  column_name: string;
  data_type: string;
  udt_name: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface TableInfo {
  table_name: string;
  columns: ColumnInfo[];
}

/**
 * Convertit un type PostgreSQL en type TypeScript
 */
function mapPgTypeToTs(pgType: string, udtName: string): string {
  const baseType = PG_TO_TS_TYPE_MAP[pgType.toLowerCase()] ||
                   PG_TO_TS_TYPE_MAP[udtName.toLowerCase()] ||
                   'any';
  return baseType;
}

/**
 * Convertit un nom de table en nom d'interface TypeScript (PascalCase)
 */
function tableNameToInterfaceName(tableName: string): string {
  return tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Génère le contenu d'un fichier d'interface TypeScript pour une table
 */
function generateInterfaceContent(tableInfo: TableInfo): string {
  const interfaceName = tableNameToInterfaceName(tableInfo.table_name);

  let content = `/**\n * Interface pour la table: ${tableInfo.table_name}\n`;
  content += ` * Générée automatiquement le ${new Date().toLocaleString('fr-FR')}\n`;
  content += ` */\n`;
  content += `export interface ${interfaceName} {\n`;

  // Générer les propriétés
  for (const column of tableInfo.columns) {
    const tsType = mapPgTypeToTs(column.data_type, column.udt_name);
    const isOptional = column.is_nullable === 'YES' || column.column_default !== null;
    const optionalMarker = isOptional ? '?' : '';

    // Ajouter un commentaire avec des infos supplémentaires
    const comments: string[] = [];
    if (column.data_type !== 'USER-DEFINED') {
      comments.push(`Type PG: ${column.data_type}`);
    } else {
      comments.push(`Type PG: ${column.udt_name}`);
    }
    if (column.character_maximum_length) {
      comments.push(`Max length: ${column.character_maximum_length}`);
    }
    if (column.column_default) {
      comments.push(`Default: ${column.column_default}`);
    }

    if (comments.length > 0) {
      content += `  /** ${comments.join(' | ')} */\n`;
    }

    content += `  ${column.column_name}${optionalMarker}: ${tsType};\n`;
  }

  content += `}\n`;

  return content;
}

/**
 * Récupère toutes les tables et leurs colonnes de la base de données
 */
async function fetchDatabaseSchema(client: Client): Promise<TableInfo[]> {
  const query = `
    SELECT
      t.table_name,
      c.column_name,
      c.data_type,
      c.udt_name,
      c.is_nullable,
      c.column_default,
      c.character_maximum_length
    FROM
      information_schema.tables t
    JOIN
      information_schema.columns c
      ON t.table_name = c.table_name
      AND t.table_schema = c.table_schema
    WHERE
      t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    ORDER BY
      t.table_name, c.ordinal_position;
  `;

  const result = await client.query<ColumnInfo & { table_name: string }>(query);

  // Grouper les colonnes par table
  const tablesMap = new Map<string, TableInfo>();

  for (const row of result.rows) {
    if (!tablesMap.has(row.table_name)) {
      tablesMap.set(row.table_name, {
        table_name: row.table_name,
        columns: []
      });
    }

    const table = tablesMap.get(row.table_name)!;
    table.columns.push({
      column_name: row.column_name,
      data_type: row.data_type,
      udt_name: row.udt_name,
      is_nullable: row.is_nullable,
      column_default: row.column_default,
      character_maximum_length: row.character_maximum_length
    });
  }

  return Array.from(tablesMap.values());
}

/**
 * Génère un fichier index.ts qui exporte toutes les interfaces
 */
function generateIndexFile(tableNames: string[]): string {
  let content = `/**\n * Index des interfaces EBP\n`;
  content += ` * Générée automatiquement le ${new Date().toLocaleString('fr-FR')}\n`;
  content += ` */\n\n`;

  for (const tableName of tableNames.sort()) {
    const interfaceName = tableNameToInterfaceName(tableName);
    content += `export * from './${tableName}';\n`;
  }

  return content;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la génération des interfaces TypeScript...\n');

  // Configuration de la connexion PostgreSQL
  const client = new Client({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'sli_db',
  });

  try {
    // Connexion à la base de données
    console.log('📡 Connexion à PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté à la base de données\n');

    // Récupérer le schéma
    console.log('📊 Récupération du schéma de la base de données...');
    const tables = await fetchDatabaseSchema(client);
    console.log(`✅ ${tables.length} tables trouvées\n`);

    // Créer le dossier de sortie
    const outputDir = path.join(__dirname, 'interface_EBP');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Supprimer les anciens fichiers
    console.log('🧹 Nettoyage des anciens fichiers...');
    const existingFiles = fs.readdirSync(outputDir);
    for (const file of existingFiles) {
      if (file.endsWith('.ts')) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    }

    // Générer les fichiers d'interface
    console.log('✍️  Génération des interfaces...\n');
    let generatedCount = 0;

    for (const table of tables) {
      const interfaceContent = generateInterfaceContent(table);
      const filePath = path.join(outputDir, `${table.table_name}.ts`);

      fs.writeFileSync(filePath, interfaceContent, 'utf-8');

      generatedCount++;
      if (generatedCount % 50 === 0) {
        console.log(`   ⏳ ${generatedCount}/${tables.length} interfaces générées...`);
      }
    }

    // Générer le fichier index
    console.log('\n📝 Génération du fichier index...');
    const indexContent = generateIndexFile(tables.map(t => t.table_name));
    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent, 'utf-8');

    console.log(`\n✅ Génération terminée avec succès !`);
    console.log(`📁 ${generatedCount} fichiers d'interface générés dans: ${outputDir}`);
    console.log(`📄 Fichier index.ts créé\n`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter le script
main();
