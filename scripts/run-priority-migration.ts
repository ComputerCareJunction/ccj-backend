import * as fs from 'fs';
import * as path from 'path';
import db from '../src/config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runPriorityMigration() {
    const pool = db.getPool();
    const client = await pool.connect();
    
    try {
        console.log('🚀 Running priority default update migration...\n');
        
        const migrationPath = path.join(__dirname, '..', 'migrations', '013_update_tickets_default_priority.sql');
        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found: ${migrationPath}`);
        }
        
        console.log('📄 Running: 013_update_tickets_default_priority.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        try {
            await client.query(migrationSQL);
            console.log('✅ Priority default update migration completed successfully!\n');
            console.log('🎉 Default priority is now set to "high"!');
        } catch (error: any) {
            // Check if error is due to column already having the default (not critical)
            if (error.message.includes('already') || error.code === '42701') {
                console.log('⚠️  Priority default may already be set, skipping...\n');
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

runPriorityMigration();

