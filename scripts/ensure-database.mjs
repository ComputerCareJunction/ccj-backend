/**
 * Ensures MySQL is reachable, creates DB_NAME if missing, applies migrations when tbl_users is absent.
 * Run: node scripts/ensure-database.mjs (from project root; loads .env)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(root, '.env') });

const dbName = process.env.DB_NAME || 'ccj_db';

async function main() {
  const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
    multipleStatements: true,
  };

  const escapedDb = dbName.replace(/`/g, '``');

  const adminConn = await mysql.createConnection(baseConfig);
  await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${escapedDb}\``);
  await adminConn.end();

  const pool = mysql.createPool({ ...baseConfig, database: dbName });

  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c FROM information_schema.tables
     WHERE table_schema = ? AND table_name = 'tbl_users'`,
    [dbName]
  );

  if (rows[0].c > 0) {
    console.log(`Database "${dbName}" reachable; schema present (tbl_users exists).`);
    await pool.end();
    return;
  }

  const migDir = path.join(root, 'migrations');
  const files = fs
    .readdirSync(migDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(migDir, f), 'utf8');
    console.log('Applying migration:', f);
    await pool.query(sql);
  }
  await pool.end();
  console.log(`Migrations applied to "${dbName}".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
