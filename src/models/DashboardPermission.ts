export enum DashboardSection {
    PRODUCTS = 'products',
    USERS = 'users',
    BLOGS = 'blogs',
    EMPLOYEES = 'employees',
}

export enum PermissionAction {
    VIEW = 'view',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
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

export class DashboardPermission implements IDashboardPermission {
    public id?: number;
    public user_id: number;
    public section: DashboardSection;
    public can_view: boolean;
    public can_create: boolean;
    public can_update: boolean;
    public can_delete: boolean;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IDashboardPermission) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.section = data.section;
        this.can_view = data.can_view;
        this.can_create = data.can_create;
        this.can_update = data.can_update;
        this.can_delete = data.can_delete;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    public hasPermission(action: PermissionAction): boolean {
        switch (action) {
            case PermissionAction.VIEW:
                return this.can_view;
            case PermissionAction.CREATE:
                return this.can_create;
            case PermissionAction.UPDATE:
                return this.can_update;
            case PermissionAction.DELETE:
                return this.can_delete;
            default:
                return false;
        }
    }
}

