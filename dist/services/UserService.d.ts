import { User, IUser } from '../models/User';
export declare class UserService {
    private userRepository;
    private authService;
    constructor();
    getAllUsers(): Promise<User[]>;
    getAllActiveUsers(): Promise<User[]>;
    getAllInactiveUsers(): Promise<User[]>;
    activateUser(id: number): Promise<User | null>;
    deactivateUser(id: number): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    createUser(data: Partial<IUser>): Promise<User>;
    updateUser(id: number, data: Partial<IUser>): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
    getSubUsers(): Promise<User[]>;
    changePassword(userId: number, newPassword: string): Promise<User | null>;
}
//# sourceMappingURL=UserService.d.ts.map