import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function recreateTables() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ccj_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL server\n');

        console.log('🗑️  Dropping existing tables (if any)...');
        
        // Drop tables in reverse order of dependencies
        const dropTables = [
            'DROP TABLE IF EXISTS tbl_attendance CASCADE;',
            'DROP TABLE IF EXISTS tbl_employees CASCADE;',
            'DROP TABLE IF EXISTS tbl_blogs CASCADE;',
            'DROP TABLE IF EXISTS tbl_products CASCADE;',
            'DROP TABLE IF EXISTS tbl_dashboard_permissions CASCADE;',
            'DROP TABLE IF EXISTS tbl_users CASCADE;',
            // Also drop old tables if they exist
            'DROP TABLE IF EXISTS attendance CASCADE;',
            'DROP TABLE IF EXISTS employees CASCADE;',
            'DROP TABLE IF EXISTS blogs CASCADE;',
            'DROP TABLE IF EXISTS products CASCADE;',
            'DROP TABLE IF EXISTS dashboard_permissions CASCADE;',
            'DROP TABLE IF EXISTS users CASCADE;',
        ];

        for (const dropSQL of dropTables) {
            try {
                await client.query(dropSQL);
            } catch (err) {
                // Ignore errors for tables that don't exist
            }
        }

        console.log('✅ Old tables dropped\n');

        // Read and execute initial schema
        const schemaPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Migration file not found: ${schemaPath}`);
        }

        console.log('📄 Creating tables with tbl_ prefix...');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSQL);
        console.log('✅ All tables created successfully!\n');

        // Run seed migration
        const seedPath = path.join(__dirname, '..', 'migrations', '002_seed_admin.sql');
        if (fs.existsSync(seedPath)) {
            console.log('📄 Seeding admin user...');
            const seedSQL = fs.readFileSync(seedPath, 'utf8');
            await client.query(seedSQL);
            console.log('✅ Admin user seeded!\n');
            console.log('🔑 Default admin credentials:');
            console.log('   Email: admin@ccj.com');
            console.log('   Password: admin123\n');
        }

        // Verify tables were created
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'tbl_%'
            ORDER BY table_name;
        `;
        const tablesResult = await client.query(tablesQuery);
        
        console.log('📊 Created tables:');
        tablesResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });

        console.log('\n🎉 Database setup completed successfully!');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

recreateTables();

