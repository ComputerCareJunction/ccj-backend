import bcrypt from 'bcryptjs';
import db from '../config/database';
import { UserRepository } from '../repositories/UserRepository';
import { DashboardPermissionRepository } from '../repositories/DashboardPermissionRepository';
import { UserRole } from '../models/User';
import { DashboardSection } from '../models/DashboardPermission';

async function seed() {
    try {
        await db.testConnection();

        const userRepository = new UserRepository();
        const permissionRepository = new DashboardPermissionRepository();

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        let admin = await userRepository.findByEmail('admin@ccj.com');
        
        if (!admin) {
            admin = await userRepository.create({
                name: 'Administrator',
                email: 'admin@ccj.com',
                password: adminPassword,
                phone: '+1234567890',
                role: UserRole.ADMIN,
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Grant all permissions to admin
        if (admin && admin.id) {
            const sections = Object.values(DashboardSection);
            for (const section of sections) {
                await permissionRepository.upsertByUserAndSection({
                    user_id: admin.id,
                    section,
                    can_view: true,
                    can_create: true,
                    can_update: true,
                    can_delete: true,
                });
            }
            console.log('Admin permissions granted');
        }

        console.log('Seeding completed successfully');
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        await db.close();
        process.exit(1);
    }
}

seed();

