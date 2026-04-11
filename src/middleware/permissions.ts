import { Response, NextFunction } from 'express';
import { PermissionService } from '../services/PermissionService';
import {
    DashboardSection,
    PermissionAction,
} from '../models/DashboardPermission';
import { AuthenticatedRequest } from './auth';

export class PermissionMiddleware {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    checkPermission = (section: DashboardSection, action: PermissionAction) => {
        return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }

                const hasPermission = await this.permissionService.checkPermission(
                    req.user.userId,
                    req.user.role as any,
                    section,
                    action
                );

                if (!hasPermission) {
                    res.status(403).json({
                        error: `Permission denied: ${action} access to ${section} section`,
                    });
                    return;
                }

                next();
            } catch (error: any) {
                res.status(500).json({ error: error.message || 'Permission check failed' });
            }
        };
    };
}

export const permissionMiddleware = new PermissionMiddleware();

