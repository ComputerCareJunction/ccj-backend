import { BaseRepository } from './BaseRepository';
import { User, IUser } from '../models/User';
export declare class UserRepository extends BaseRepository<User> {
    constructor();
    findAll(): Promise<User[]>;
    findAllActive(): Promise<User[]>;
    findAllInactive(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<IUser>): Promise<User>;
    update(id: number, data: Partial<IUser>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
    findSubUsers(): Promise<User[]>;
    updatePassword(id: number, hashedPassword: string): Promise<User | null>;
    private mapRowToUser;
}
//# sourceMappingURL=UserRepository.d.ts.map