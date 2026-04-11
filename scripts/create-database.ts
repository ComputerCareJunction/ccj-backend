import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createDatabase() {
    // Parse connection parameters from DATABASE_URL or use individual parameters
    const dbUrl = process.env.DATABASE_URL;
    const targetDbName = process.env.DB_NAME || 'ccj_db';
    
    let connectionConfig: mysql.ConnectionOptions;
    
    if (dbUrl && dbUrl.startsWith('mysql://')) {
        const url = new URL(dbUrl);
        connectionConfig = {
            host: url.hostname,
            port: url.port ? parseInt(url.port) : 3306,
            user: url.username,
            password: url.password,
            // Don't specify database yet, we'll create it
        };
    } else {
        connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
        };
    }

    try {
        // First connection without database to check/create database
        const connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Connected to MySQL server\n');

        // Check if database exists
        const [databases] = await connection.query(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [targetDbName]
        ) as any;

        if (databases.length > 0) {
            console.log(`ℹ️  Database '${targetDbName}' already exists`);
        } else {
            // Create database
            console.log(`📦 Creating database '${targetDbName}'...`);
            await connection.query(`CREATE DATABASE ${targetDbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            console.log(`✅ Database '${targetDbName}' created successfully!\n`);
        }

        await connection.end();

        // Now connect to the new database and run migrations
        console.log('🔄 Connecting to new database and running migrations...\n');

        const dbConnection = await mysql.createConnection({
            ...connectionConfig,
            database: targetDbName,
        });

        console.log(`✅ Connected to '${targetDbName}' database\n`);

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
                await dbConnection.query(statement);
            }
        }
        console.log('✅ Initial schema migration completed!\n');

        // Run seed migration
        const seedPath = path.join(__dirname, '..', 'migrations', '002_seed_admin.sql');
        if (fs.existsSync(seedPath)) {
            console.log('📄 Running: 002_seed_admin.sql');
            const seedSQL = fs.readFileSync(seedPath, 'utf8');
            const seedStatements = seedSQL.split(';').filter(stmt => stmt.trim());
            for (const statement of seedStatements) {
                if (statement.trim()) {
                    try {
                        await dbConnection.query(statement);
                    } catch (error: any) {
                        // Seed might not have SQL, that's okay - seed data is handled by TypeScript script
                        if (!error.message.includes('Syntax error')) {
                            throw error;
                        }
                    }
                }
            }
            console.log('✅ Admin seed migration completed!\n');
            console.log('🔑 Default admin credentials (will be set by seed script):');
            console.log('   Email: admin@ccj.com');
            console.log('   Password: admin123\n');
        }

        await dbConnection.end();

        console.log('🎉 Database setup completed successfully!');
        console.log('\n📊 Database Information:');
        console.log(`   Host: ${connectionConfig.host}`);
        console.log(`   Port: ${connectionConfig.port}`);
        console.log(`   Database: ${targetDbName}`);
        console.log(`   User: ${connectionConfig.user}`);
        console.log('\n✅ You can now start the server with: npm run dev');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
            console.error('\n💡 MySQL is not running or not accessible.');
            console.error('');
            console.error('   Please ensure MySQL is installed and running:');
            console.error('   1. Windows: Start "MySQL80" service from Services app');
            console.error('      - Or run: net start MySQL80');
            console.error('   2. macOS: brew services start mysql');
            console.error('   3. Linux: sudo systemctl start mysql');
            console.error('   4. Or use Docker: docker-compose up -d');
            console.error('');
            console.error('   See MYSQL_SETUP.md for detailed instructions.\n');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Authentication failed.');
            console.error('   Please check your database user and password in .env file.');
            console.error('   Default: root:root\n');
        } else if (error.code === 'ENOTFOUND') {
            console.error('\n💡 Cannot find MySQL server.');
            console.error('   Please ensure MySQL is installed and the service is running.');
            console.error('   Check the host in .env file (default: localhost)\n');
        }
        
        process.exit(1);
    }
}

createDatabase();


