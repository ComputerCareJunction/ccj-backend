import { User, UserRole } from '../models/User';
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
export declare class AuthService {
    private userRepository;
    constructor();
    register(data: RegisterData, role?: UserRole): Promise<User>;
    login(credentials: LoginCredentials): Promise<{
        user: User;
        token: string;
    }>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(payload: AuthTokenPayload): string;
    verifyToken(token: string): AuthTokenPayload;
}
//# sourceMappingURL=AuthService.d.ts.map