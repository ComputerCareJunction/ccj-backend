"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const User_1 = require("../models/User");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('tbl_users');
    }
    async findAll() {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToUser(row));
    }
    async findAllActive() {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE status = $1 ORDER BY created_at DESC`, [User_1.UserStatus.ACTIVE]);
        return result.rows.map(row => this.mapRowToUser(row));
    }
    async findAllInactive() {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE status = $1 ORDER BY created_at DESC`, [User_1.UserStatus.INACTIVE]);
        return result.rows.map(row => this.mapRowToUser(row));
    }
    async findById(id) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }
    async findByEmail(email) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }
    async create(data) {
        const result = await this.query(`INSERT INTO ${this.tableName} (name, email, password, phone, role, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`, [
            data.name,
            data.email,
            data.password,
            data.phone || null,
            data.role || User_1.UserRole.CUSTOMER,
            data.status || User_1.UserStatus.ACTIVE,
        ]);
        return this.mapRowToUser(result.rows[0]);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
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
        const result = await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }
    async delete(id) {
        // Soft delete: set status to inactive instead of deleting
        const result = await this.query(`UPDATE ${this.tableName} SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id`, [User_1.UserStatus.INACTIVE, id]);
        return result.rows.length > 0;
    }
    async findSubUsers() {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE role = $1 ORDER BY created_at DESC`, [User_1.UserRole.SUB_USER]);
        return result.rows.map(row => this.mapRowToUser(row));
    }
    async updatePassword(id, hashedPassword) {
        const result = await this.query(`UPDATE ${this.tableName} SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`, [hashedPassword, id]);
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }
    mapRowToUser(row) {
        return new User_1.User({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            phone: row.phone,
            role: row.role,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map