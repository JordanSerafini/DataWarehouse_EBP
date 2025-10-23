/**
 * Script d'analyse des colonnes EBP
 * Identifie les colonnes à exclure de la vérification
 */

import EBPClient from '../clients/ebp.clients';

async function analyzeColumns() {
  console.log('\n========================================');
  console.log('ANALYSE DES COLONNES EBP');
  console.log('========================================\n');

  await EBPClient.connect();

  // Récupérer toutes les colonnes de toutes les tables
  const query = `
    SELECT
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE,
      CHARACTER_MAXIMUM_LENGTH,
      IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `;

  const result = await EBPClient.query(query);
  const columns = result.recordset;

  // Analyser les patterns de colonnes
  const columnPatterns: { [key: string]: number } = {};
  const systemColumns: Set<string> = new Set();

  columns.forEach((col: any) => {
    const colName = col.COLUMN_NAME.toLowerCase();

    // Compter les occurrences
    columnPatterns[colName] = (columnPatterns[colName] || 0) + 1;

    // Identifier les colonnes système/techniques
    if (
      colName.includes('rowversion') ||
      colName.includes('timestamp') ||
      colName.includes('created') ||
      colName.includes('modified') ||
      colName.includes('updated') ||
      colName.includes('sync') ||
      colName === 'id' ||
      colName === 'sysid' ||
      colName.includes('internalid') ||
      colName.includes('guid')
    ) {
      systemColumns.add(col.COLUMN_NAME);
    }
  });

  console.log('📊 TOP 20 colonnes les plus fréquentes:\n');
  const sortedPatterns = Object.entries(columnPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  sortedPatterns.forEach(([name, count]) => {
    console.log(`  ${name.padEnd(30)} → ${count} tables`);
  });

  console.log('\n\n🔧 Colonnes système détectées (à exclure de la vérification):\n');
  const systemColumnsArray = Array.from(systemColumns).sort();
  systemColumnsArray.forEach(col => {
    const count = columnPatterns[col.toLowerCase()] || 0;
    console.log(`  - ${col.padEnd(40)} (${count} tables)`);
  });

  console.log(`\n\nTotal: ${systemColumnsArray.length} colonnes système identifiées\n`);

  // Générer la liste pour le code
  console.log('📝 Configuration recommandée pour verification.service.ts:\n');
  console.log('const EXCLUDED_COLUMNS = [');
  systemColumnsArray.slice(0, 30).forEach(col => {
    console.log(`  '${col}',`);
  });
  console.log('];\n');

  process.exit(0);
}

analyzeColumns().catch(error => {
  console.error('Erreur:', error);
  process.exit(1);
});
