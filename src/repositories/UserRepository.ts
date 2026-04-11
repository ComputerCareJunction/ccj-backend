import { BaseRepository } from './BaseRepository';
import { User, IUser, UserRole, UserStatus } from '../models/User';
import { QueryResult } from 'pg';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('tbl_users');
    }

    async findAll(): Promise<User[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToUser(row));
    }

    async findAllActive(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE status = $1 ORDER BY created_at DESC`,
            [UserStatus.ACTIVE]
        );
        return result.rows.map(row => this.mapRowToUser(row));
    }

    async findAllInactive(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE status = $1 ORDER BY created_at DESC`,
            [UserStatus.INACTIVE]
        );
        return result.rows.map(row => this.mapRowToUser(row));
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    async create(data: Partial<IUser>): Promise<User> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (name, email, password, phone, role, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                data.name,
                data.email,
                data.password,
                data.phone || null,
                data.role || UserRole.CUSTOMER,
                data.status || UserStatus.ACTIVE,
            ]
        );
        return this.mapRowToUser(result.rows[0]);
    }

    async update(id: number, data: Partial<IUser>): Promise<User | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.email !== undefined) {
            updates.push(`email = $${paramCount++}`);
            values.push(data.email);
        }
        if (data.password !== undefined) {
            updates.push(`password = $${paramCount++}`);
            values.push(data.password);
        }
        if (data.phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(data.phone);
        }
        if (data.role !== undefined) {
            updates.push(`role = $${paramCount++}`);
            values.push(data.role);
        }
        if (data.status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(data.status);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result = await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        // Soft delete: set status to inactive instead of deleting
        const result = await this.query(
            `UPDATE ${this.tableName} SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id`,
            [UserStatus.INACTIVE, id]
        );
        return result.rows.length > 0;
    }

    async findSubUsers(): Promise<User[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE role = $1 ORDER BY created_at DESC`,
            [UserRole.SUB_USER]
        );
        return result.rows.map(row => this.mapRowToUser(row));
    }

    async updatePassword(id: number, hashedPassword: string): Promise<User | null> {
        const result = await this.query(
            `UPDATE ${this.tableName} SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [hashedPassword, id]
        );
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
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

