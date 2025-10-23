const { Pool } = require('pg');
const sql = require('mssql');
require('dotenv').config();

async function checkThresholdType() {
  const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
  });

  const mssqlConfig = {
    server: process.env.CLIENT_EBP_SERVER,
    database: process.env.CLIENT_EBP_DATABASE,
    user: process.env.EBP_USER,
    password: process.env.EBP_PASSWORD,
    options: {
      trustServerCertificate: true,
      encrypt: true
    }
  };

  try {
    await sql.connect(mssqlConfig);

    // Get MSSQL type
    const mssqlType = await sql.query(`
      SELECT
        DATA_TYPE as dataType,
        NUMERIC_PRECISION as precision,
        NUMERIC_SCALE as scale
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'PriceListCalculationLine'
        AND COLUMN_NAME = 'Threshold'
    `);

    console.log('MSSQL Threshold column:');
    console.log(mssqlType.recordset[0]);
    console.log('');

    // Get PostgreSQL type
    const pgType = await pool.query(`
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'PriceListCalculationLine'
        AND column_name = 'Threshold'
    `);

    console.log('PostgreSQL Threshold column:');
    console.log(pgType.rows[0]);
    console.log('');

    // Try to insert the problematic value directly
    console.log('Testing insert of value 100000000000000000000:');
    try {
      await pool.query('BEGIN');
      await pool.query(`
        INSERT INTO "PriceListCalculationLine" ("Id", "Threshold")
        VALUES ('00000000-0000-0000-0000-000000000001', 100000000000000000000)
      `);
      await pool.query('ROLLBACK');
      console.log('✅ Insert successful (rolled back)');
    } catch (insertError) {
      await pool.query('ROLLBACK');
      console.log('❌ Insert failed:', insertError.message);
    }

    // Try with string
    console.log('\nTesting insert of string "100000000000000000000":');
    try {
      await pool.query('BEGIN');
      await pool.query(`
        INSERT INTO "PriceListCalculationLine" ("Id", "Threshold")
        VALUES ('00000000-0000-0000-0000-000000000002', $1)
      `, ['100000000000000000000']);
      await pool.query('ROLLBACK');
      console.log('✅ Insert successful (rolled back)');
    } catch (insertError) {
      await pool.query('ROLLBACK');
      console.log('❌ Insert failed:', insertError.message);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sql.close();
    await pool.end();
  }
}

checkThresholdType();
