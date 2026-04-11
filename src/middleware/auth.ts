import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}

export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'No token provided' });
                return;
            }

            const token = authHeader.substring(7);
            const payload = this.authService.verifyToken(token);
            req.user = payload;

            next();
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Invalid token' });
        }
    };

    requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (req.user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        next();
    };
}

export const authMiddleware = new AuthMiddleware();

