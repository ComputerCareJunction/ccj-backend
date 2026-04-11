import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class UserController {
    private userService;
    constructor();
    getAllUsers: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getUserById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    activateUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deactivateUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getSubUsers: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    changePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map