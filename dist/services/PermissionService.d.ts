import { DashboardPermission, DashboardSection, PermissionAction } from '../models/DashboardPermission';
import { UserRole } from '../models/User';
export declare class PermissionService {
    private permissionRepository;
    constructor();
    checkPermission(userId: number, userRole: UserRole, section: DashboardSection, action: PermissionAction): Promise<boolean>;
    getUserPermissions(userId: number): Promise<DashboardPermission[]>;
    setPermission(userId: number, section: DashboardSection, permissions: {
        can_view: boolean;
        can_create: boolean;
        can_update: boolean;
        can_delete: boolean;
    }): Promise<DashboardPermission>;
    setAllPermissions(userId: number, permissions: Array<{
        section: DashboardSection;
        can_view: boolean;
        can_create: boolean;
        can_update: boolean;
        can_delete: boolean;
    }>): Promise<DashboardPermission[]>;
    deleteUserPermissions(userId: number): Promise<boolean>;
}
//# sourceMappingURL=PermissionService.d.ts.map