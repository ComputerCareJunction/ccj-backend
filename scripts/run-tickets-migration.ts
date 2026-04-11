import * as fs from 'fs';
import * as path from 'path';
import db from '../src/config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runTicketsMigration() {
    const pool = db.getPool();
    const client = await pool.connect();
    
    try {
        console.log('🚀 Running tickets table migration...\n');
        
        const migrationPath = path.join(__dirname, '..', 'migrations', '012_create_tickets_table.sql');
        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found: ${migrationPath}`);
        }
        
        console.log('📄 Running: 012_create_tickets_table.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        try {
            await client.query(migrationSQL);
            console.log('✅ Tickets table migration completed successfully!\n');
            console.log('🎉 Tickets table is now ready to use!');
        } catch (error: any) {
            // Check if error is due to table already existing (not critical)
            if (error.code === '42P07' || error.message.includes('already exists')) {
                console.log('⚠️  Tickets table already exists, skipping...\n');
            } else {
                throw error;
            }
        }
        
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        if (error.code === 'ECONNREFUSED' || error.code === '28P01') {
            console.error('\n💡 Database connection failed.');
            console.error('   Please ensure:');
            console.error('   1. PostgreSQL is running');
            console.error('   2. DATABASE_URL is set correctly in .env file');
            console.error('   3. Database credentials are correct\n');
        }
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runTicketsMigration();

