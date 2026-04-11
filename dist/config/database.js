"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from project root (works for both src/ and dist/)
// Use process.cwd() to get the project root directory
const envPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
class DatabaseConfig {
    constructor() {
        const isProduction = process.env.NODE_ENV === 'production';
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
        });
        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(1);
        });
    }
    getPool() {
        return this.pool;
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            console.log('✅ Database connection established successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Database connection error:', error);
            return false;
        }
    }
    async close() {
        await this.pool.end();
    }
}
exports.default = new DatabaseConfig();
//# sourceMappingURL=database.js.map