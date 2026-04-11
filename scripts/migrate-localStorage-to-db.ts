/**
 * Migration Script: Migrate localStorage data to PostgreSQL database
 * 
 * This script reads data from browser localStorage (if available via API)
 * and migrates it to the database.
 * 
 * Usage: 
 * 1. Export localStorage data from browser console:
 *    JSON.stringify({
 *      blogs: localStorage.getItem('admin_blogs'),
 *      products: localStorage.getItem('admin_products'),
 *      users: localStorage.getItem('admin_users'),
 *      employees: localStorage.getItem('admin_employees'),
 *      attendance: localStorage.getItem('admin_attendance')
 *    })
 * 
 * 2. Save to a file (e.g., localStorage-data.json)
 * 
 * 3. Run this script: ts-node scripts/migrate-localStorage-to-db.ts localStorage-data.json
 */

import * as fs from 'fs';
import * as path from 'path';
import db from '../src/config/database';

interface LocalStorageData {
    blogs?: string;
    products?: string;
    users?: string;
    employees?: string;
    attendance?: string;
}

async function migrateBlogs(blogs: any[]) {
    console.log(`Migrating ${blogs.length} blogs...`);
    for (const blog of blogs) {
        try {
            await db.query(
                `INSERT INTO tbl_blogs (title, content, description, author, date, image, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                 ON CONFLICT DO NOTHING`,
                [
                    blog.title,
                    blog.content,
                    blog.description || blog.excerpt || '',
                    blog.author,
                    blog.date,
                    blog.image || null,
                ]
            );
        } catch (error: any) {
            console.error(`Error migrating blog ${blog.id}:`, error.message);
        }
    }
    console.log('Blogs migration complete');
}

async function migrateProducts(products: any[]) {
    console.log(`Migrating ${products.length} products...`);
    for (const product of products) {
        try {
            await db.query(
                `INSERT INTO tbl_products (name, slug, image, price, description, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                 ON CONFLICT DO NOTHING`,
                [
                    product.name,
                    product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
                    product.image,
                    product.price,
                    product.description,
                ]
            );
        } catch (error: any) {
            console.error(`Error migrating product ${product.id}:`, error.message);
        }
    }
    console.log('Products migration complete');
}

async function migrateUsers(users: any[]) {
    console.log(`Migrating ${users.length} users...`);
    for (const user of users) {
        try {
            // Skip if user already exists
            const existing = await db.query('SELECT id FROM tbl_users WHERE email = $1', [user.email]);
            if (existing.rows.length > 0) continue;

            await db.query(
                `INSERT INTO tbl_users (name, email, phone, role, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                 ON CONFLICT (email) DO NOTHING`,
                [
                    user.name,
                    user.email,
                    user.phone || '',
                    user.role || 'customer',
                    user.status || 'active',
                ]
            );
        } catch (error: any) {
            console.error(`Error migrating user ${user.id}:`, error.message);
        }
    }
    console.log('Users migration complete');
}

async function migrateEmployees(employees: any[]) {
    console.log(`Migrating ${employees.length} employees...`);
    for (const employee of employees) {
        try {
            await db.query(
                `INSERT INTO tbl_employees (employee_id, name, email, phone, position, department, hire_date, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
                 ON CONFLICT (employee_id) DO NOTHING`,
                [
                    employee.employeeId || `CCJ-${String(employee.id).slice(-2).padStart(2, '0')}`,
                    employee.name,
                    employee.email,
                    employee.phone || '',
                    employee.position || '',
                    employee.department || '',
                    employee.hireDate,
                    employee.status || 'active',
                ]
            );
        } catch (error: any) {
            console.error(`Error migrating employee ${employee.id}:`, error.message);
        }
    }
    console.log('Employees migration complete');
}

async function migrateAttendance(attendance: any[]) {
    console.log(`Migrating ${attendance.length} attendance records...`);
    for (const record of attendance) {
        try {
            // Get employee database ID from employeeId (frontend uses employee.id)
            const employeeDbId = record.employeeId || record.employee_id;
            if (!employeeDbId) {
                console.warn(`Skipping attendance record ${record.id}: no employeeId`);
                continue;
            }

            await db.query(
                `INSERT INTO tbl_attendance (employee_id, date, check_in, check_out, status, notes, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                 ON CONFLICT (employee_id, date) DO NOTHING`,
                [
                    employeeDbId,
                    record.date,
                    record.checkIn || record.check_in || null,
                    record.checkOut || record.check_out || null,
                    record.status || 'present',
                    record.notes || null,
                ]
            );
        } catch (error: any) {
            console.error(`Error migrating attendance ${record.id}:`, error.message);
        }
    }
    console.log('Attendance migration complete');
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: ts-node migrate-localStorage-to-db.ts <localStorage-data.json>');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data: LocalStorageData = JSON.parse(fileContent);

    try {
        // Test database connection
        await db.testConnection();
        console.log('✅ Database connected\n');

        if (data.blogs) {
            const blogs = JSON.parse(data.blogs);
            if (Array.isArray(blogs)) await migrateBlogs(blogs);
        }

        if (data.products) {
            const products = JSON.parse(data.products);
            if (Array.isArray(products)) await migrateProducts(products);
        }

        if (data.users) {
            const users = JSON.parse(data.users);
            if (Array.isArray(users)) await migrateUsers(users);
        }

        if (data.employees) {
            const employees = JSON.parse(data.employees);
            if (Array.isArray(employees)) await migrateEmployees(employees);
        }

        if (data.attendance) {
            const attendance = JSON.parse(data.attendance);
            if (Array.isArray(attendance)) await migrateAttendance(attendance);
        }

        console.log('\n✅ Migration complete!');
    } catch (error: any) {
        console.error('Migration error:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

main();

