import { BaseRepository } from './BaseRepository';
import {
    DashboardPermission,
    IDashboardPermission,
    DashboardSection,
} from '../models/DashboardPermission';
import { QueryResult } from 'pg';

export class DashboardPermissionRepository extends BaseRepository<DashboardPermission> {
    constructor() {
        super('tbl_dashboard_permissions');
    }

    async findAll(): Promise<DashboardPermission[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY user_id, section`);
        return result.rows.map(row => this.mapRowToPermission(row));
    }

    async findById(id: number): Promise<DashboardPermission | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToPermission(result.rows[0]) : null;
    }

    async findByUserId(userId: number): Promise<DashboardPermission[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE user_id = $1 ORDER BY section`,
            [userId]
        );
        return result.rows.map(row => this.mapRowToPermission(row));
    }

    async findByUserAndSection(
        userId: number,
        section: DashboardSection
    ): Promise<DashboardPermission | null> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE user_id = $1 AND section = $2`,
            [userId, section]
        );
        return result.rows.length > 0 ? this.mapRowToPermission(result.rows[0]) : null;
    }

    async create(data: Partial<IDashboardPermission>): Promise<DashboardPermission> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (user_id, section, can_view, can_create, can_update, can_delete)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                data.user_id!,
                data.section!,
                data.can_view ?? false,
                data.can_create ?? false,
                data.can_update ?? false,
                data.can_delete ?? false,
            ]
        );
        return this.mapRowToPermission(result.rows[0]);
    }

    async update(id: number, data: Partial<IDashboardPermission>): Promise<DashboardPermission | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.can_view !== undefined) {
            updates.push(`can_view = $${paramCount++}`);
            values.push(data.can_view);
        }
        if (data.can_create !== undefined) {
            updates.push(`can_create = $${paramCount++}`);
            values.push(data.can_create);
        }
        if (data.can_update !== undefined) {
            updates.push(`can_update = $${paramCount++}`);
            values.push(data.can_update);
        }
        if (data.can_delete !== undefined) {
            updates.push(`can_delete = $${paramCount++}`);
            values.push(data.can_delete);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result = await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows.length > 0 ? this.mapRowToPermission(result.rows[0]) : null;
    }

    async upsertByUserAndSection(data: IDashboardPermission): Promise<DashboardPermission> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (user_id, section, can_view, can_create, can_update, can_delete)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (user_id, section)
             DO UPDATE SET
                 can_view = EXCLUDED.can_view,
                 can_create = EXCLUDED.can_create,
                 can_update = EXCLUDED.can_update,
                 can_delete = EXCLUDED.can_delete,
                 updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                data.user_id,
                data.section,
                data.can_view,
                data.can_create,
                data.can_update,
                data.can_delete,
            ]
        );
        return this.mapRowToPermission(result.rows[0]);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }

    async deleteByUserId(userId: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE user_id = $1 RETURNING id`, [userId]);
        return result.rowCount ? result.rowCount > 0 : false;
    }

    private mapRowToPermission(row: any): DashboardPermission {
        return new DashboardPermission({
            id: row.id,
            user_id: row.user_id,
            section: row.section as DashboardSection,
            can_view: row.can_view,
            can_create: row.can_create,
            can_update: row.can_update,
            can_delete: row.can_delete,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}

