import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class PermissionController {
    private permissionService;
    constructor();
    getUserPermissions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    setPermission: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    setAllPermissions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteUserPermissions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=PermissionController.d.ts.map