"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthMiddleware {
    constructor() {
        this.authenticate = async (req, res, next) => {
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
            }
            catch (error) {
                res.status(401).json({ error: error.message || 'Invalid token' });
            }
        };
        this.requireAdmin = async (req, res, next) => {
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
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=auth.js.map