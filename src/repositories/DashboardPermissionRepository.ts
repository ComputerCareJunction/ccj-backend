import { BaseRepository } from './BaseRepository';
import {
    DashboardPermission,
    IDashboardPermission,
    DashboardSection,
} from '../models/DashboardPermission';

export class DashboardPermissionRepository extends BaseRepository<DashboardPermission> {
    constructor() {
        super('tbl_dashboard_permissions');
    }

    async findAll(): Promise<DashboardPermission[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY user_id, section`);
        return result.rows.map((row) => this.mapRowToPermission(row));
    }

    async findById(id: number): Promise<DashboardPermission | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.rows.length > 0 ? this.mapRowToPermission(result.rows[0]) : null;
    }

    async findByUserId(userId: number): Promise<DashboardPermission[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY section`,
            [userId]
        );
        return result.rows.map((row) => this.mapRowToPermission(row));
    }

    async findByUserAndSection(
        userId: number,
        section: DashboardSection
    ): Promise<DashboardPermission | null> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE user_id = ? AND section = ?`,
            [userId, section]
        );
        return result.rows.length > 0 ? this.mapRowToPermission(result.rows[0]) : null;
    }

    async create(data: Partial<IDashboardPermission>): Promise<DashboardPermission> {
        const ins = await this.query(
            `INSERT INTO ${this.tableName} (user_id, section, can_view, can_create, can_update, can_delete)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.user_id!,
                data.section!,
                data.can_view ?? false,
                data.can_create ?? false,
                data.can_update ?? false,
                data.can_delete ?? false,
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create dashboard permission');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToPermission(fetched.rows[0]);
    }

    async update(id: number, data: Partial<IDashboardPermission>): Promise<DashboardPermission | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.can_view !== undefined) {
            updates.push(`can_view = ?`);
            values.push(data.can_view);
        }
        if (data.can_create !== undefined) {
            updates.push(`can_create = ?`);
            values.push(data.can_create);
        }
        if (data.can_update !== undefined) {
            updates.push(`can_update = ?`);
            values.push(data.can_update);
        }
        if (data.can_delete !== undefined) {
            updates.push(`can_delete = ?`);
            values.push(data.can_delete);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async upsertByUserAndSection(data: IDashboardPermission): Promise<DashboardPermission> {
        await this.query(
            `INSERT INTO ${this.tableName} (user_id, section, can_view, can_create, can_update, can_delete)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                 can_view = VALUES(can_view),
                 can_create = VALUES(can_create),
                 can_update = VALUES(can_update),
                 can_delete = VALUES(can_delete),
                 updated_at = CURRENT_TIMESTAMP`,
            [
                data.user_id,
                data.section,
                data.can_view,
                data.can_create,
                data.can_update,
                data.can_delete,
            ]
        );

        const found = await this.findByUserAndSection(data.user_id, data.section);
        if (!found) {
            throw new Error('Failed to upsert dashboard permission');
        }
        return found;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async deleteByUserId(userId: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE user_id = ?`, [userId]);
        return (result.rowCount ?? 0) > 0;
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
