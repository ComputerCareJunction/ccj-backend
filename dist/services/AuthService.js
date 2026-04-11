"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const User_1 = require("../models/User");
const env_1 = require("../config/env");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async register(data, role = User_1.UserRole.CUSTOMER) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await this.hashPassword(data.password);
        return await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role,
        });
    }
    async login(credentials) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user || !user.password) {
            throw new Error('Invalid email or password');
        }
        const isValidPassword = await this.verifyPassword(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    }
    async hashPassword(password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        return await bcryptjs_1.default.hash(password, salt);
    }
    async verifyPassword(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    generateToken(payload) {
        // JWT_EXPIRES_IN is a valid time string (e.g., "7d", "1h") which is compatible with SignOptions
        const options = {
            expiresIn: env_1.EnvironmentConfig.JWT_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.EnvironmentConfig.JWT_SECRET, options);
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.EnvironmentConfig.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map