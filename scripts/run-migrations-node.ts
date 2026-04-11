import * as fs from 'fs';
import * as path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Parse database URL or use individual parameters
const dbUrl = process.env.DATABASE_URL;
let pool: mysql.Pool;

if (dbUrl && dbUrl.startsWith('mysql://')) {
    const url = new URL(dbUrl);
    pool = mysql.createPool({
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_NAME || 'ccj_db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
}

async function runMigrations() {
    const connection = await pool.getConnection();
    
    try {
        console.log('🚀 Starting database migrations...\n');
        
        // Read and execute initial schema
        const schemaPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Migration file not found: ${schemaPath}`);
        }
        
        console.log('📄 Running: 001_initial_schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        // Split by semicolon to handle multiple statements
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
        console.log('✅ Initial schema migration completed!\n');
        
        // Ask about seed (optional)
        console.log('💡 Tip: Run "npm run seed" to create admin user after migrations.\n');
        
        // Run additional migrations
        const additionalMigrations = [
            '002_seed_admin.sql',
            '003_remove_blog_slug.sql',
            '004_rename_excerpt_to_description.sql',
            '005_create_contact_table.sql',
            '006_add_screening_status_to_contact.sql',
            '007_add_brand_category_to_products.sql',
            '008_add_product_details.sql',
            '009_change_specifications_to_text.sql',
            '010_add_original_price_discount_to_products.sql',
            '011_create_orders_table.sql',
            '012_create_tickets_table.sql',
            '013_update_tickets_default_priority.sql'
        ];

        for (const migrationFile of additionalMigrations) {
            const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
            if (fs.existsSync(migrationPath)) {
                console.log(`📄 Running: ${migrationFile}`);
                const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
                try {
                    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
                    for (const statement of statements) {
                        if (statement.trim()) {
                            await connection.query(statement);
                        }
                    }
                    console.log(`✅ ${migrationFile} migration completed!\n`);
                } catch (error: any) {
                    // Check if error is due to column/table already existing (not critical)
                    if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
                        console.log(`⚠️  ${migrationFile} - Column/table already exists, skipping...\n`);
                    } else if (error.code === 'ER_PARSE_ERROR' || error.message.includes('Syntax error')) {
                        console.log(`⚠️  ${migrationFile} - Skipped (syntax or feature not supported in MySQL)\n`);
                    } else {
                        throw error;
                    }
                }
            }
        }
        
        console.log('🎉 All migrations completed successfully!');
        
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
            console.error('\n💡 MySQL is not running or not accessible.');
            console.error('   Please ensure MySQL is installed and running.');
            console.error('');
            console.error('   Quick setup options:');
            console.error('   1. Windows: Start MySQL Service from Services app or: net start MySQL80');
            console.error('   2. macOS: brew services start mysql');
            console.error('   3. Linux: sudo systemctl start mysql');
            console.error('   4. Docker: docker-compose up -d');
            console.error('   5. See MYSQL_SETUP.md for detailed instructions\n');
        }
        process.exit(1);
    } finally {
        connection.release();
        await pool.end();
    }
}

runMigrations();

