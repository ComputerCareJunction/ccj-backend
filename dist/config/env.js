"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from project root (works for both src/ and dist/)
// Use process.cwd() to get the project root directory
const envPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
class EnvironmentConfig {
}
exports.EnvironmentConfig = EnvironmentConfig;
EnvironmentConfig.PORT = parseInt(process.env.PORT || '5000', 10);
EnvironmentConfig.NODE_ENV = process.env.NODE_ENV || 'development';
EnvironmentConfig.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
EnvironmentConfig.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
EnvironmentConfig.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
//# sourceMappingURL=env.js.map