import { BaseRepository } from './BaseRepository';
import { Attendance, IAttendance, AttendanceStatus } from '../models/Attendance';
import { QueryResult } from 'pg';

export class AttendanceRepository extends BaseRepository<Attendance> {
    constructor() {
        super('tbl_attendance');
    }

    async findAll(): Promise<Attendance[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY date DESC, created_at DESC`);
        return result.rows.map(row => this.mapRowToAttendance(row));
    }

    async findById(id: number): Promise<Attendance | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToAttendance(result.rows[0]) : null;
    }

    async findByEmployeeId(employeeId: number): Promise<Attendance[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE employee_id = $1 ORDER BY date DESC`,
            [employeeId]
        );
        return result.rows.map(row => this.mapRowToAttendance(row));
    }

    async findByEmployeeAndDate(employeeId: number, date: Date): Promise<Attendance | null> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE employee_id = $1 AND date = $2`,
            [employeeId, date]
        );
        return result.rows.length > 0 ? this.mapRowToAttendance(result.rows[0]) : null;
    }

    async create(data: Partial<IAttendance>): Promise<Attendance> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (employee_id, date, check_in, check_out, status, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                data.employee_id!,
                data.date!,
                data.check_in || null,
                data.check_out || null,
                data.status || AttendanceStatus.PRESENT,
                data.notes || null,
            ]
        );
        return this.mapRowToAttendance(result.rows[0]);
    }

    async update(id: number, data: Partial<IAttendance>): Promise<Attendance | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.date !== undefined) {
            updates.push(`date = $${paramCount++}`);
            values.push(data.date);
        }
        if (data.check_in !== undefined) {
            updates.push(`check_in = $${paramCount++}`);
            values.push(data.check_in);
        }
        if (data.check_out !== undefined) {
            updates.push(`check_out = $${paramCount++}`);
            values.push(data.check_out);
        }
        if (data.status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(data.status);
        }
        if (data.notes !== undefined) {
            updates.push(`notes = $${paramCount++}`);
            values.push(data.notes);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result = await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows.length > 0 ? this.mapRowToAttendance(result.rows[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }

    async getAttendanceStats(employeeId: number): Promise<{
        present: number;
        absent: number;
        total: number;
    }> {
        const result = await this.query(
            `SELECT 
                COUNT(*) FILTER (WHERE status IN ('present', 'late', 'half-day')) as present,
                COUNT(*) FILTER (WHERE status = 'absent') as absent,
                COUNT(*) as total
             FROM ${this.tableName}
             WHERE employee_id = $1`,
            [employeeId]
        );
        const row = result.rows[0];
        return {
            present: parseInt(row.present) || 0,
            absent: parseInt(row.absent) || 0,
            total: parseInt(row.total) || 0,
        };
    }

    private mapRowToAttendance(row: any): Attendance {
        return new Attendance({
            id: row.id,
            employee_id: row.employee_id,
            date: new Date(row.date),
            check_in: row.check_in,
            check_out: row.check_out,
            status: row.status as AttendanceStatus,
            notes: row.notes,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}

