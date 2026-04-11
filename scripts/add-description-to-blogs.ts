import dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addDescriptionColumn() {
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

        // Check if description column exists
        const checkColumn = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tbl_blogs' AND column_name = 'description'
        `);

        if (checkColumn.rows.length === 0) {
            console.log('📝 Adding description column to tbl_blogs...');
            await client.query(`
                ALTER TABLE tbl_blogs 
                ADD COLUMN description TEXT
            `);
            console.log('✅ Description column added successfully!\n');
        } else {
            console.log('✅ Description column already exists\n');
        }

        // Also check for excerpt column (if needed)
        const checkExcerpt = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tbl_blogs' AND column_name = 'excerpt'
        `);

        if (checkExcerpt.rows.length === 0) {
            console.log('📝 Adding excerpt column to tbl_blogs...');
            await client.query(`
                ALTER TABLE tbl_blogs 
                ADD COLUMN excerpt TEXT
            `);
            console.log('✅ Excerpt column added successfully!\n');
        } else {
            console.log('✅ Excerpt column already exists\n');
        }

        // Verify table structure
        const columns = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tbl_blogs'
            ORDER BY ordinal_position
        `);

        console.log('📊 tbl_blogs table structure:');
        columns.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });

        console.log('\n🎉 Migration completed!');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

addDescriptionColumn();

