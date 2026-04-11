import { UserRepository } from '../repositories/UserRepository';
import { User, IUser, UserRole, UserStatus } from '../models/User';
import { AuthService } from './AuthService';

export class UserService {
    private userRepository: UserRepository;
    private authService: AuthService;

    constructor() {
        this.userRepository = new UserRepository();
        this.authService = new AuthService();
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async getAllActiveUsers(): Promise<User[]> {
        return await this.userRepository.findAllActive();
    }

    async getAllInactiveUsers(): Promise<User[]> {
        return await this.userRepository.findAllInactive();
    }

    async activateUser(id: number): Promise<User | null> {
        return await this.userRepository.update(id, { status: UserStatus.ACTIVE });
    }

    async deactivateUser(id: number): Promise<User | null> {
        return await this.userRepository.update(id, { status: UserStatus.INACTIVE });
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async createUser(data: Partial<IUser>): Promise<User> {
        if (data.password) {
            data.password = await this.authService.hashPassword(data.password);
        }
        return await this.userRepository.create(data);
    }

    async updateUser(id: number, data: Partial<IUser>): Promise<User | null> {
        if (data.password) {
            data.password = await this.authService.hashPassword(data.password);
        }
        return await this.userRepository.update(id, data);
    }

    async deleteUser(id: number): Promise<boolean> {
        return await this.userRepository.delete(id);
    }

    async getSubUsers(): Promise<User[]> {
        return await this.userRepository.findSubUsers();
    }

    async changePassword(userId: number, newPassword: string): Promise<User | null> {
        const hashedPassword = await this.authService.hashPassword(newPassword);
        return await this.userRepository.updatePassword(userId, hashedPassword);
    }
}

