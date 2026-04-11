import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (works for both src/ and dist/)
// Use process.cwd() to get the project root directory
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export class EnvironmentConfig {
    public static readonly PORT: number = parseInt(process.env.PORT || '5000', 10);
    public static readonly NODE_ENV: string = process.env.NODE_ENV || 'development';
    public static readonly FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';
    public static readonly API_URL: string = process.env.API_URL || 'http://localhost:5000/api';
    public static readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-this';
    public static readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';
    
    // Cloudinary configuration
    public static readonly CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || '';
    public static readonly CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || '';
    public static readonly CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || '';
}

