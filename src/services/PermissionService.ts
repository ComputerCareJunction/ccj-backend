import { DashboardPermissionRepository } from '../repositories/DashboardPermissionRepository';
import {
    DashboardPermission,
    DashboardSection,
    PermissionAction,
} from '../models/DashboardPermission';
import { UserRole } from '../models/User';

export class PermissionService {
    private permissionRepository: DashboardPermissionRepository;

    constructor() {
        this.permissionRepository = new DashboardPermissionRepository();
    }

    async checkPermission(
        userId: number,
        userRole: UserRole,
        section: DashboardSection,
        action: PermissionAction
    ): Promise<boolean> {
        // Admin has all permissions
        if (userRole === UserRole.ADMIN) {
            return true;
        }

        // Sub-users need explicit permissions
        if (userRole === UserRole.SUB_USER) {
            const permission = await this.permissionRepository.findByUserAndSection(userId, section);
            if (!permission) {
                return false;
            }
            return permission.hasPermission(action);
        }

        // Customers don't have dashboard access
        return false;
    }

    async getUserPermissions(userId: number): Promise<DashboardPermission[]> {
        return await this.permissionRepository.findByUserId(userId);
    }

    async setPermission(
        userId: number,
        section: DashboardSection,
        permissions: {
            can_view: boolean;
            can_create: boolean;
            can_update: boolean;
            can_delete: boolean;
        }
    ): Promise<DashboardPermission> {
        return await this.permissionRepository.upsertByUserAndSection({
            user_id: userId,
            section,
            ...permissions,
        });
    }

    async setAllPermissions(
        userId: number,
        permissions: Array<{
            section: DashboardSection;
            can_view: boolean;
            can_create: boolean;
            can_update: boolean;
            can_delete: boolean;
        }>
    ): Promise<DashboardPermission[]> {
        const results: DashboardPermission[] = [];
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

    async deleteUserPermissions(userId: number): Promise<boolean> {
        return await this.permissionRepository.deleteByUserId(userId);
    }
}

