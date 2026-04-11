"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const UserRepository_1 = require("../repositories/UserRepository");
const DashboardPermissionRepository_1 = require("../repositories/DashboardPermissionRepository");
const User_1 = require("../models/User");
const DashboardPermission_1 = require("../models/DashboardPermission");
async function seed() {
    try {
        await database_1.default.testConnection();
        const userRepository = new UserRepository_1.UserRepository();
        const permissionRepository = new DashboardPermissionRepository_1.DashboardPermissionRepository();
        // Create admin user
        const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
        let admin = await userRepository.findByEmail('admin@ccj.com');
        if (!admin) {
            admin = await userRepository.create({
                name: 'Administrator',
                email: 'admin@ccj.com',
                password: adminPassword,
                phone: '+1234567890',
                role: User_1.UserRole.ADMIN,
            });
            console.log('Admin user created');
        }
        else {
            console.log('Admin user already exists');
        }
        // Grant all permissions to admin
        if (admin && admin.id) {
            const sections = Object.values(DashboardPermission_1.DashboardSection);
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
        await database_1.default.close();
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        await database_1.default.close();
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map