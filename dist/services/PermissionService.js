"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const DashboardPermissionRepository_1 = require("../repositories/DashboardPermissionRepository");
const User_1 = require("../models/User");
class PermissionService {
    constructor() {
        this.permissionRepository = new DashboardPermissionRepository_1.DashboardPermissionRepository();
    }
    async checkPermission(userId, userRole, section, action) {
        // Admin has all permissions
        if (userRole === User_1.UserRole.ADMIN) {
            return true;
        }
        // Sub-users need explicit permissions
        if (userRole === User_1.UserRole.SUB_USER) {
            const permission = await this.permissionRepository.findByUserAndSection(userId, section);
            if (!permission) {
                return false;
            }
            return permission.hasPermission(action);
        }
        // Customers don't have dashboard access
        return false;
    }
    async getUserPermissions(userId) {
        return await this.permissionRepository.findByUserId(userId);
    }
    async setPermission(userId, section, permissions) {
        return await this.permissionRepository.upsertByUserAndSection({
            user_id: userId,
            section,
            ...permissions,
        });
    }
    async setAllPermissions(userId, permissions) {
        const results = [];
        for (const perm of permissions) {
            const result = await this.setPermission(userId, perm.section, {
                can_view: perm.can_view,
                can_create: perm.can_create,
                can_update: perm.can_update,
                can_delete: perm.can_delete,
            });
            results.push(result);
        }
        return results;
    }
    async deleteUserPermissions(userId) {
        return await this.permissionRepository.deleteByUserId(userId);
    }
}
exports.PermissionService = PermissionService;
//# sourceMappingURL=PermissionService.js.map