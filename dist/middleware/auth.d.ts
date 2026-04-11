import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}
export declare class AuthMiddleware {
    private authService;
    constructor();
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
export declare const authMiddleware: AuthMiddleware;
//# sourceMappingURL=auth.d.ts.map