/**
 * Script de debug pour analyser une table spécifique
 * Usage: npx ts-node src/debug-table.ts AccountingExchangeGroupProcessDetail
 */

import EBPClient from '../clients/ebp.clients';
import DatabaseService from './services/database.service';
import SyncService from './services/sync.service';

const tableName = process.argv[2] || 'AccountingExchangeGroupProcessDetail';

async function debugTable() {
  console.log(`\n========================================`);
  console.log(`DEBUG TABLE: ${tableName}`);
  console.log(`========================================\n`);

  try {
    // Initialiser les connexions
    await EBPClient.connect();
    await DatabaseService.initializePool();

    // 1. Récupérer les métadonnées
    console.log('1️⃣  Métadonnées de la table:\n');
    const metadata = await SyncService.getTableMetadata(tableName, 'dbo');

    console.log(`   Colonnes: ${metadata.columns.length}`);
    console.log(`   Clés primaires: ${metadata.primaryKeys.length > 0 ? metadata.primaryKeys.join(', ') : '⚠️ AUCUNE'}`);
    console.log(`   Lignes EBP: ${metadata.rowCount}`);

    // 2. Récupérer 1 ligne d'exemple depuis EBP
    console.log('\n2️⃣  Exemple de ligne EBP:\n');
    const ebpQuery = `SELECT TOP 1 * FROM [dbo].[${tableName}]`;
    const ebpResult = await EBPClient.query(ebpQuery);

    if (ebpResult.recordset.length > 0) {
      const ebpRow = ebpResult.recordset[0];
      console.log('   Colonnes présentes:', Object.keys(ebpRow).join(', '));

      if (metadata.primaryKeys.length > 0) {
        console.log('\n   Valeurs des clés primaires:');
        metadata.primaryKeys.forEach(pk => {
          console.log(`     ${pk} = ${ebpRow[pk]}`);
        });
      }
    }

    // 3. Vérifier si la table existe dans PG
    console.log('\n3️⃣  Table PostgreSQL:\n');
    const pgTableExists = await DatabaseService.tableExists(tableName);
    console.log(`   Existe: ${pgTableExists ? '✅ OUI' : '❌ NON'}`);

    if (pgTableExists) {
      const pgCount = await DatabaseService.countRows(tableName);
      console.log(`   Lignes PG: ${pgCount}`);

      // 4. Récupérer 1 ligne depuis PG
      console.log('\n4️⃣  Exemple de ligne PostgreSQL:\n');
      const pgResult = await DatabaseService.query(`SELECT * FROM "${tableName}" LIMIT 1`);

      if (pgResult.rows.length > 0) {
        const pgRow = pgResult.rows[0];
        console.log('   Colonnes présentes:', Object.keys(pgRow).join(', '));

        if (metadata.primaryKeys.length > 0) {
          console.log('\n   Valeurs des clés primaires:');
          metadata.primaryKeys.forEach(pk => {
            console.log(`     ${pk} = ${pgRow[pk]}`);
          });
        }
      }

      // 5. Tenter de récupérer une ligne EBP dans PG avec les clés primaires
      if (metadata.primaryKeys.length > 0 && ebpResult.recordset.length > 0) {
        console.log('\n5️⃣  Test de récupération par clé primaire:\n');

        const ebpRow = ebpResult.recordset[0];
        const whereConditions = metadata.primaryKeys.map((pk, idx) => {
          return `"${pk}" = $${idx + 1}`;
        }).join(' AND ');

        const pkValues = metadata.primaryKeys.map(pk => ebpRow[pk]);

        console.log(`   WHERE: ${whereConditions}`);
        console.log(`   VALUES: ${pkValues.join(', ')}`);

        try {
          const matchResult = await DatabaseService.query(
            `SELECT * FROM "${tableName}" WHERE ${whereConditions}`,
            pkValues
          );

          console.log(`   Résultat: ${matchResult.rows.length} ligne(s) trouvée(s)`);

          if (matchResult.rows.length === 0) {
            console.log('\n   ⚠️  PROBLÈME: La ligne EBP n\'a pas été trouvée dans PG avec les clés primaires!');
            console.log('\n   Vérification si les clés existent dans PG:');

            for (const pk of metadata.primaryKeys) {
              const checkQuery = `SELECT COUNT(*) as count, MIN("${pk}") as min, MAX("${pk}") as max FROM "${tableName}"`;
              const checkResult = await DatabaseService.query(checkQuery);
              console.log(`     ${pk}: ${checkResult.rows[0].count} valeurs (min: ${checkResult.rows[0].min}, max: ${checkResult.rows[0].max})`);
            }
          } else {
            console.log('\n   ✅ La ligne a été trouvée avec succès!');

            // Comparer les valeurs
            console.log('\n6️⃣  Comparaison des valeurs:\n');
            const pgRow = matchResult.rows[0];

            let differences = 0;
            metadata.columns.forEach(col => {
              const ebpVal = ebpRow[col.columnName];
              const pgVal = pgRow[col.columnName];

              if (ebpVal !== pgVal) {
                differences++;
                if (differences <= 10) { // Limiter l'affichage
                  console.log(`     ${col.columnName}:`);
                  console.log(`       EBP: ${ebpVal} (${typeof ebpVal})`);
                  console.log(`       PG:  ${pgVal} (${typeof pgVal})`);
                }
              }
            });

            console.log(`\n   Total différences: ${differences}/${metadata.columns.length} colonnes`);
          }
        } catch (error) {
          console.error('   ❌ Erreur lors de la récupération:', (error as Error).message);
        }
      } else {
        console.log('\n   ⚠️  Pas de clé primaire définie - impossible de faire une correspondance exacte');
      }
    }

    console.log('\n========================================\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit(0);
  }
}

debugTable();
