import { Response, NextFunction } from 'express';
import { DashboardSection, PermissionAction } from '../models/DashboardPermission';
import { AuthenticatedRequest } from './auth';
export declare class PermissionMiddleware {
    private permissionService;
    constructor();
    checkPermission: (section: DashboardSection, action: PermissionAction) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
export declare const permissionMiddleware: PermissionMiddleware;
//# sourceMappingURL=permissions.d.ts.map