import { BaseRepository } from './BaseRepository';
import { User, IUser, UserRole, UserStatus } from '../models/User';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('tbl_users');
    }

    async findAll(): Promise<User[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map((row) => this.mapRowToUser(row));
    }

    async findAllActive(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE status = ? ORDER BY created_at DESC`,
            [UserStatus.ACTIVE]
        );
        return result.rows.map((row) => this.mapRowToUser(row));
    }

    async findAllInactive(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE status = ? ORDER BY created_at DESC`,
            [UserStatus.INACTIVE]
        );
        return result.rows.map((row) => this.mapRowToUser(row));
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE email = ?`, [email]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    async create(data: Partial<IUser>): Promise<User> {
        const ins = await this.query(
            `INSERT INTO ${this.tableName} (name, email, password, phone, role, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.name,
                data.email,
                data.password,
                data.phone || null,
                data.role || UserRole.CUSTOMER,
                data.status || UserStatus.ACTIVE,
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create user');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToUser(fetched.rows[0]);
    }

    async update(id: number, data: Partial<IUser>): Promise<User | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push(`name = ?`);
            values.push(data.name);
        }
        if (data.email !== undefined) {
            updates.push(`email = ?`);
            values.push(data.email);
        }
        if (data.password !== undefined) {
            updates.push(`password = ?`);
            values.push(data.password);
        }
        if (data.phone !== undefined) {
            updates.push(`phone = ?`);
            values.push(data.phone);
        }
        if (data.role !== undefined) {
            updates.push(`role = ?`);
            values.push(data.role);
        }
        if (data.status !== undefined) {
            updates.push(`status = ?`);
            values.push(data.status);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(
            `UPDATE ${this.tableName} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [UserStatus.INACTIVE, id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async findSubUsers(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE role = ? ORDER BY created_at DESC`,
            [UserRole.SUB_USER]
        );
        return result.rows.map((row) => this.mapRowToUser(row));
    }

    async updatePassword(id: number, hashedPassword: string): Promise<User | null> {
        await this.query(
            `UPDATE ${this.tableName} SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [hashedPassword, id]
        );
        return this.findById(id);
    }

    private mapRowToUser(row: any): User {
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            phone: row.phone,
            role: row.role as UserRole,
            status: row.status as UserStatus,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
