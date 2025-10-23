import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface TableAnalysis {
  table_name: string;
  column_count: number;
  row_count: number;
  estimated_size: string;
  business_domain?: string;
  importance_score?: number;
}

interface ColumnAnalysis {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  has_default: boolean;
  is_foreign_key: boolean;
  referenced_table?: string;
}

const BUSINESS_DOMAINS = {
  SALES: 'Ventes',
  PURCHASE: 'Achats',
  STOCK: 'Stock',
  CUSTOMER: 'Clients',
  SUPPLIER: 'Fournisseurs',
  ACCOUNTING: 'Comptabilité',
  HR: 'Ressources Humaines',
  SCHEDULING: 'Planification',
  MAINTENANCE: 'Maintenance',
  CONSTRUCTION: 'Chantiers',
  SYSTEM: 'Système',
  REFERENCE: 'Référentiels',
  ANALYTICS: 'Analytique'
};

/**
 * Identifie le domaine métier d'une table
 */
function identifyBusinessDomain(tableName: string): string {
  const name = tableName.toLowerCase();

  // Ventes
  if (name.includes('sale') || name.includes('customer') || name.includes('deal')) {
    return BUSINESS_DOMAINS.SALES;
  }

  // Achats
  if (name.includes('purchase') || name.includes('supplier')) {
    return BUSINESS_DOMAINS.PURCHASE;
  }

  // Stock
  if (name.includes('stock') || name.includes('item') || name.includes('range')) {
    return BUSINESS_DOMAINS.STOCK;
  }

  // Comptabilité
  if (name.includes('accounting') || name.includes('commitment') || name.includes('settlement') || name.includes('bank')) {
    return BUSINESS_DOMAINS.ACCOUNTING;
  }

  // RH
  if (name.includes('colleague') || name.includes('payroll')) {
    return BUSINESS_DOMAINS.HR;
  }

  // Planification
  if (name.includes('schedule') || name.includes('activity')) {
    return BUSINESS_DOMAINS.SCHEDULING;
  }

  // Maintenance
  if (name.includes('maintenance') || name.includes('incident')) {
    return BUSINESS_DOMAINS.MAINTENANCE;
  }

  // Chantiers
  if (name.includes('construction')) {
    return BUSINESS_DOMAINS.CONSTRUCTION;
  }

  // Système
  if (name.startsWith('ebpsys')) {
    return BUSINESS_DOMAINS.SYSTEM;
  }

  // Référentiels
  if (name.includes('country') || name.includes('zipcode') || name.includes('civility') ||
      name.includes('family') || name.includes('type') || name.includes('category')) {
    return BUSINESS_DOMAINS.REFERENCE;
  }

  // Analytique
  if (name.includes('analytic') || name.includes('grid')) {
    return BUSINESS_DOMAINS.ANALYTICS;
  }

  return 'Autre';
}

/**
 * Calcule un score d'importance pour une table
 */
function calculateImportanceScore(table: TableAnalysis): number {
  let score = 0;

  // Plus de lignes = plus important
  if (table.row_count > 10000) score += 5;
  else if (table.row_count > 1000) score += 3;
  else if (table.row_count > 100) score += 1;

  // Tables métier principales
  const highPriorityKeywords = ['customer', 'item', 'sale', 'purchase', 'stock', 'supplier'];
  if (highPriorityKeywords.some(kw => table.table_name.toLowerCase().includes(kw))) {
    score += 10;
  }

  // Tables de référence
  const referenceKeywords = ['family', 'type', 'category', 'mode'];
  if (referenceKeywords.some(kw => table.table_name.toLowerCase().includes(kw))) {
    score += 5;
  }

  // Tables système - moins prioritaires
  if (table.table_name.startsWith('EbpSys')) {
    score -= 5;
  }

  // Tables avec beaucoup de colonnes sont souvent complexes et importantes
  if (table.column_count > 100) score += 3;

  return Math.max(0, score);
}

/**
 * Détecte les relations potentielles basées sur les noms de colonnes
 */
function detectPotentialRelations(columnName: string, currentTable: string): string | null {
  const name = columnName.toLowerCase();

  // Pattern: TableId ou Table_Id
  const idPattern = /^(.+)id$/i;
  const match = name.match(idPattern);

  if (match && !name.startsWith('sys') && name !== 'uniqueid') {
    const potentialTable = match[1]
      .replace(/_/g, '')
      .split(/(?=[A-Z])/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');

    return potentialTable;
  }

  return null;
}

async function analyzeDatabase() {
  console.log('🔍 Démarrage de l\'analyse de la base de données EBP...\n');

  const client = new Client({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'ebp_db',
  });

  try {
    await client.connect();
    console.log('✅ Connecté à la base de données\n');

    // 1. Analyse des tables
    console.log('📊 Analyse des tables...');
    const tablesQuery = `
      SELECT
        t.table_name,
        COUNT(c.column_name) as column_count
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c
        ON t.table_name = c.table_name
        AND t.table_schema = c.table_schema
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name
      ORDER BY t.table_name;
    `;

    const tablesResult = await client.query(tablesQuery);
    const tables: TableAnalysis[] = [];

    // Obtenir le nombre de lignes pour chaque table
    for (const row of tablesResult.rows) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as cnt FROM "${row.table_name}"`);
        const rowCount = parseInt(countResult.rows[0].cnt);

        const table: TableAnalysis = {
          table_name: row.table_name,
          column_count: parseInt(row.column_count),
          row_count: rowCount,
          estimated_size: '0 KB',
          business_domain: identifyBusinessDomain(row.table_name)
        };

        table.importance_score = calculateImportanceScore(table);
        tables.push(table);
      } catch (err) {
        console.error(`Erreur pour la table ${row.table_name}:`, err);
      }
    }

    console.log(`✅ ${tables.length} tables analysées\n`);

    // 2. Analyse des colonnes et relations
    console.log('🔗 Analyse des colonnes et relations potentielles...');
    const columnsQuery = `
      SELECT
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const columnsResult = await client.query(columnsQuery);
    const columns: ColumnAnalysis[] = columnsResult.rows.map(row => {
      const refTable = detectPotentialRelations(row.column_name, row.table_name);
      return {
        table_name: row.table_name,
        column_name: row.column_name,
        data_type: row.data_type,
        is_nullable: row.is_nullable,
        has_default: row.column_default !== null,
        is_foreign_key: false,
        referenced_table: refTable || undefined
      };
    });

    console.log(`✅ ${columns.length} colonnes analysées\n`);

    // 3. Grouper par domaine métier
    const domainGroups = tables.reduce((acc, table) => {
      const domain = table.business_domain || 'Autre';
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(table);
      return acc;
    }, {} as Record<string, TableAnalysis[]>);

    // 4. Générer le rapport
    console.log('📝 Génération du rapport d\'audit...\n');

    let report = `# AUDIT COMPLET DE LA BASE DE DONNÉES EBP\n\n`;
    report += `Date d'analyse: ${new Date().toLocaleString('fr-FR')}\n\n`;
    report += `---\n\n`;

    // Vue d'ensemble
    report += `## 1. VUE D'ENSEMBLE\n\n`;
    report += `- **Nombre total de tables**: ${tables.length}\n`;
    report += `- **Nombre total de colonnes**: ${columns.length}\n`;
    report += `- **Nombre total de lignes**: ${tables.reduce((sum, t) => sum + t.row_count, 0).toLocaleString('fr-FR')}\n\n`;

    // Statistiques par domaine
    report += `## 2. RÉPARTITION PAR DOMAINE MÉTIER\n\n`;
    report += `| Domaine | Nombre de tables | Total de lignes |\n`;
    report += `|---------|------------------|----------------|\n`;

    Object.entries(domainGroups)
      .sort(([, a], [, b]) => b.reduce((s, t) => s + t.row_count, 0) - a.reduce((s, t) => s + t.row_count, 0))
      .forEach(([domain, domainTables]) => {
        const totalRows = domainTables.reduce((sum, t) => sum + t.row_count, 0);
        report += `| ${domain} | ${domainTables.length} | ${totalRows.toLocaleString('fr-FR')} |\n`;
      });

    report += `\n`;

    // Top tables par volumétrie
    report += `## 3. TOP 30 TABLES PAR VOLUMÉTRIE\n\n`;
    report += `| Table | Domaine | Lignes | Colonnes | Score |\n`;
    report += `|-------|---------|--------|----------|-------|\n`;

    tables
      .sort((a, b) => b.row_count - a.row_count)
      .slice(0, 30)
      .forEach(table => {
        report += `| ${table.table_name} | ${table.business_domain} | ${table.row_count.toLocaleString('fr-FR')} | ${table.column_count} | ${table.importance_score} |\n`;
      });

    report += `\n`;

    // Top tables par complexité (nombre de colonnes)
    report += `## 4. TOP 30 TABLES PAR COMPLEXITÉ (Nombre de colonnes)\n\n`;
    report += `| Table | Domaine | Colonnes | Lignes | Score |\n`;
    report += `|-------|---------|----------|--------|-------|\n`;

    tables
      .sort((a, b) => b.column_count - a.column_count)
      .slice(0, 30)
      .forEach(table => {
        report += `| ${table.table_name} | ${table.business_domain} | ${table.column_count} | ${table.row_count.toLocaleString('fr-FR')} | ${table.importance_score} |\n`;
      });

    report += `\n`;

    // Tables critiques (score élevé)
    report += `## 5. TABLES CRITIQUES (Score d'importance > 10)\n\n`;
    report += `| Table | Domaine | Score | Lignes | Colonnes |\n`;
    report += `|-------|---------|-------|--------|----------|\n`;

    tables
      .filter(t => (t.importance_score || 0) > 10)
      .sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0))
      .forEach(table => {
        report += `| ${table.table_name} | ${table.business_domain} | ${table.importance_score} | ${table.row_count.toLocaleString('fr-FR')} | ${table.column_count} |\n`;
      });

    report += `\n`;

    // Détail par domaine
    report += `## 6. DÉTAIL PAR DOMAINE MÉTIER\n\n`;

    Object.entries(domainGroups)
      .sort(([, a], [, b]) => b.reduce((s, t) => s + t.row_count, 0) - a.reduce((s, t) => s + t.row_count, 0))
      .forEach(([domain, domainTables]) => {
        report += `### ${domain}\n\n`;
        report += `**Nombre de tables**: ${domainTables.length}\n\n`;

        report += `| Table | Lignes | Colonnes | Score |\n`;
        report += `|-------|--------|----------|-------|\n`;

        domainTables
          .sort((a, b) => b.row_count - a.row_count)
          .slice(0, 15)
          .forEach(table => {
            report += `| ${table.table_name} | ${table.row_count.toLocaleString('fr-FR')} | ${table.column_count} | ${table.importance_score} |\n`;
          });

        report += `\n`;
      });

    // Relations détectées
    report += `## 7. RELATIONS POTENTIELLES DÉTECTÉES\n\n`;
    report += `Analyse basée sur les noms de colonnes se terminant par "Id".\n\n`;

    const relations = columns
      .filter(c => c.referenced_table && c.referenced_table !== c.table_name)
      .slice(0, 100);

    report += `| Table source | Colonne | Table référencée (potentielle) |\n`;
    report += `|--------------|---------|-------------------------------|\n`;

    relations.forEach(rel => {
      report += `| ${rel.table_name} | ${rel.column_name} | ${rel.referenced_table} |\n`;
    });

    report += `\n`;
    report += `**Note**: ${relations.length} relations potentielles détectées (affichage limité à 100)\n\n`;

    // Sauvegarder le rapport
    const outputPath = path.join(__dirname, 'AUDIT_DATABASE.md');
    fs.writeFileSync(outputPath, report, 'utf-8');

    console.log(`✅ Rapport d'audit généré: ${outputPath}\n`);

    // Générer aussi un fichier JSON avec toutes les données
    const jsonData = {
      generated_at: new Date().toISOString(),
      summary: {
        total_tables: tables.length,
        total_columns: columns.length,
        total_rows: tables.reduce((sum, t) => sum + t.row_count, 0)
      },
      tables: tables,
      domains: domainGroups,
      relations: relations
    };

    const jsonPath = path.join(__dirname, 'database_analysis.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    console.log(`✅ Données d'analyse JSON générées: ${jsonPath}\n`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

analyzeDatabase();
