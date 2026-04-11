import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function fixAdminPassword() {
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

        // Hash the password properly
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log('🔑 Generated password hash\n');

        // Check if admin exists
        const checkUser = await client.query(
            'SELECT id, email FROM tbl_users WHERE email = $1',
            ['admin@ccj.com']
        );

        if (checkUser.rows.length === 0) {
            // Create admin user
            console.log('📝 Creating admin user...');
            const result = await client.query(
                `INSERT INTO tbl_users (name, email, password, phone, role, status)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                ['Administrator', 'admin@ccj.com', hashedPassword, '+1234567890', 'admin', 'active']
            );
            console.log('✅ Admin user created\n');

            // Grant permissions
            const userId = result.rows[0].id;
            const sections = ['products', 'users', 'blogs', 'employees'];
            for (const section of sections) {
                await client.query(
                    `INSERT INTO tbl_dashboard_permissions (user_id, section, can_view, can_create, can_update, can_delete)
                     VALUES ($1, $2, true, true, true, true)
                     ON CONFLICT (user_id, section) DO UPDATE
                     SET can_view = true, can_create = true, can_update = true, can_delete = true`,
                    [userId, section]
                );
            }
            console.log('✅ Admin permissions granted\n');
        } else {
            // Update admin password
            console.log('📝 Updating admin password...');
            await client.query(
                'UPDATE tbl_users SET password = $1 WHERE email = $2',
                [hashedPassword, 'admin@ccj.com']
            );
            console.log('✅ Admin password updated\n');
        }

        console.log('🎉 Admin password fixed!');
        console.log('Email: admin@ccj.com');
        console.log('Password: admin123\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

fixAdminPassword();

