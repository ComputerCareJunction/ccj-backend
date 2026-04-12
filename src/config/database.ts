import mysql from 'mysql2/promise';
import { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (works for both src/ and dist/)
// Use process.cwd() to get the project root directory
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

class DatabaseConfig {
  private pool: Pool;
  private readonly databaseName: string;

  constructor() {
    // Parse MySQL connection string or use individual config parameters
    // Supported formats:
    // mysql://user:password@host:port/database
    // mysql://user:password@host/database (default port 3306)
    
    const dbUrl = process.env.DATABASE_URL;
    let config: mysql.PoolOptions;

    if (dbUrl && dbUrl.startsWith('mysql://')) {
      // Parse connection string
      const url = new URL(dbUrl);
      config = {
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1), // Remove leading slash
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
    } else {
      // Use individual environment variables (fallback)
      config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ccj_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
    }

    this.databaseName =
      (config.database && String(config.database)) ||
      process.env.DB_NAME ||
      'ccj_db';

    this.pool = mysql.createPool(config);

    // mysql2 Pool extends EventEmitter; typings omit 'error' on promise pool
    (this.pool as unknown as { on(event: 'error', fn: (err: Error) => void): void }).on(
      'error',
      (err: Error) => {
        console.error('Unexpected error on idle connection', err);
        process.exit(1);
      }
    );
  }

  public getPool(): Pool {
    return this.pool;
  }

  /** Resolved database name from DATABASE_URL or DB_NAME (for logs / dev hints). */
  public getDatabaseName(): string {
    return this.databaseName;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection error:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export default new DatabaseConfig();
