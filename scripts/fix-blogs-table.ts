import dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function fixBlogsTable() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ccj_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Check current table structure
        const columns = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'tbl_blogs'
            ORDER BY ordinal_position
        `);

        console.log('📊 Current tbl_blogs structure:');
        const existingColumns = columns.rows.map((col: any) => col.column_name);
        columns.rows.forEach((col: any) => {
            console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        console.log('');

        // Required columns based on frontend and backend
        const requiredColumns = {
            'id': 'SERIAL PRIMARY KEY',
            'title': 'VARCHAR(255) NOT NULL',
            'content': 'TEXT NOT NULL',
            'description': 'TEXT',
            'excerpt': 'TEXT',
            'author': 'VARCHAR(255) NOT NULL',
            'date': 'DATE NOT NULL',
            'image': 'TEXT',
            'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        };

        // Add missing columns
        for (const [colName, colDef] of Object.entries(requiredColumns)) {
            if (!existingColumns.includes(colName)) {
                console.log(`📝 Adding column: ${colName}...`);
                
                // Extract just the type for ALTER TABLE
                let alterDef = colDef.replace('SERIAL PRIMARY KEY', 'SERIAL');
                alterDef = alterDef.replace('PRIMARY KEY', '');
                alterDef = alterDef.replace('NOT NULL', '');
                alterDef = alterDef.replace('DEFAULT CURRENT_TIMESTAMP', '');
                alterDef = alterDef.trim();
                
                if (colDef.includes('NOT NULL') && colName !== 'id') {
                    // For NOT NULL columns, add as nullable first, then update existing rows, then set NOT NULL
                    await client.query(`ALTER TABLE tbl_blogs ADD COLUMN ${colName} ${alterDef}`);
                    if (colName === 'description' || colName === 'excerpt') {
                        // Set default empty string for text fields
                        await client.query(`UPDATE tbl_blogs SET ${colName} = '' WHERE ${colName} IS NULL`);
                    }
                    if (colName === 'date') {
                        await client.query(`UPDATE tbl_blogs SET ${colName} = CURRENT_DATE WHERE ${colName} IS NULL`);
                    }
                    if (colDef.includes('NOT NULL')) {
                        await client.query(`ALTER TABLE tbl_blogs ALTER COLUMN ${colName} SET NOT NULL`);
                    }
                } else {
                    await client.query(`ALTER TABLE tbl_blogs ADD COLUMN ${colName} ${alterDef}`);
                }
                console.log(`✅ Column ${colName} added`);
            }
        }

        // Remove slug column if it exists (not needed)
        if (existingColumns.includes('slug')) {
            console.log(`🗑️  Removing slug column (not needed)...`);
            await client.query(`ALTER TABLE tbl_blogs DROP COLUMN IF EXISTS slug`);
            console.log(`✅ Slug column removed`);
        }

        // Verify final structure
        const finalColumns = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'tbl_blogs'
            ORDER BY ordinal_position
        `);

        console.log('\n📊 Final tbl_blogs structure:');
        finalColumns.rows.forEach((col: any) => {
            console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

        console.log('\n🎉 Table structure updated successfully!');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

fixBlogsTable();

