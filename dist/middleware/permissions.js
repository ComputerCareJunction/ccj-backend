"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionMiddleware = exports.PermissionMiddleware = void 0;
const PermissionService_1 = require("../services/PermissionService");
class PermissionMiddleware {
    constructor() {
        this.checkPermission = (section, action) => {
            return async (req, res, next) => {
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Authentication required' });
                        return;
                    }
                    const hasPermission = await this.permissionService.checkPermission(req.user.userId, req.user.role, section, action);
                    if (!hasPermission) {
                        res.status(403).json({
                            error: `Permission denied: ${action} access to ${section} section`,
                        });
                        return;
                    }
                    next();
                }
                catch (error) {
                    res.status(500).json({ error: error.message || 'Permission check failed' });
                }
            };
        };
        this.permissionService = new PermissionService_1.PermissionService();
    }
}
exports.PermissionMiddleware = PermissionMiddleware;
exports.permissionMiddleware = new PermissionMiddleware();
//# sourceMappingURL=permissions.js.map