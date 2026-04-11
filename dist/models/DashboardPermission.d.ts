export declare enum DashboardSection {
    PRODUCTS = "products",
    USERS = "users",
    BLOGS = "blogs",
    EMPLOYEES = "employees"
}
export declare enum PermissionAction {
    VIEW = "view",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export interface IDashboardPermission {
    id?: number;
    user_id: number;
    section: DashboardSection;
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export declare class DashboardPermission implements IDashboardPermission {
    id?: number;
    user_id: number;
    section: DashboardSection;
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IDashboardPermission);
    hasPermission(action: PermissionAction): boolean;
}
//# sourceMappingURL=DashboardPermission.d.ts.map