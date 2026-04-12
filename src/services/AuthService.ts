import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../models/User';
import { EnvironmentConfig } from '../config/env';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface AuthTokenPayload {
    userId: number;
    email: string;
    role: UserRole;
}

export const PASSWORD_RESET_JWT_PURPOSE = 'password_reset';

export interface PasswordResetTokenPayload {
    purpose: typeof PASSWORD_RESET_JWT_PURPOSE;
    userId: number;
    email: string;
}

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data: RegisterData, role: UserRole = UserRole.CUSTOMER): Promise<User> {
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

    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user || !user.password) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await this.verifyPassword(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken({
            userId: user.id!,
            email: user.email,
            role: user.role,
        });

        return { user, token };
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    generateToken(payload: AuthTokenPayload): string {
        // JWT_EXPIRES_IN is a valid time string (e.g., "7d", "1h") which is compatible with SignOptions
        const options: SignOptions = {
            expiresIn: EnvironmentConfig.JWT_EXPIRES_IN as any,
        };
        return jwt.sign(payload, EnvironmentConfig.JWT_SECRET, options);
    }

    verifyToken(token: string): AuthTokenPayload {
        try {
            return jwt.verify(token, EnvironmentConfig.JWT_SECRET) as AuthTokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    generatePasswordResetToken(userId: number, email: string): string {
        const payload: PasswordResetTokenPayload = {
            purpose: PASSWORD_RESET_JWT_PURPOSE,
            userId,
            email,
        };
        return jwt.sign(payload, EnvironmentConfig.JWT_SECRET, { expiresIn: '15m' } as jwt.SignOptions);
    }

    verifyPasswordResetToken(token: string): { userId: number; email: string } {
        try {
            const decoded = jwt.verify(token, EnvironmentConfig.JWT_SECRET) as jwt.JwtPayload &
                Partial<PasswordResetTokenPayload>;
            if (
                decoded.purpose !== PASSWORD_RESET_JWT_PURPOSE ||
                typeof decoded.userId !== 'number' ||
                typeof decoded.email !== 'string'
            ) {
                throw new Error('Invalid or expired reset token');
            }
            return { userId: decoded.userId, email: decoded.email };
        } catch {
            throw new Error('Invalid or expired reset token');
        }
    }
}

