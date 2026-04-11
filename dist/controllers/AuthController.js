"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required' });
                    return;
                }
                const { user, token } = await this.authService.login({ email, password });
                res.json({
                    success: true,
                    token,
                    user: user.toPublicJSON(),
                });
            }
            catch (error) {
                res.status(401).json({ error: error.message || 'Login failed' });
            }
        };
        this.register = async (req, res) => {
            try {
                const { name, email, password, phone } = req.body;
                if (!name || !email || !password || !phone) {
                    res.status(400).json({ error: 'All fields are required' });
                    return;
                }
                const user = await this.authService.register({ name, email, password, phone });
                res.status(201).json({
                    success: true,
                    user: user.toPublicJSON(),
                });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Registration failed' });
            }
        };
        this.getProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                // Get full user details from database
                const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/UserRepository')));
                const userRepository = new UserRepository();
                const user = await userRepository.findById(req.user.userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({
                    success: true,
                    user: user.toPublicJSON(),
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to get profile' });
            }
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map