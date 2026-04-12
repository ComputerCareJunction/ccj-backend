import { BaseRepository } from './BaseRepository';
import { Attendance, IAttendance, AttendanceStatus } from '../models/Attendance';

export class AttendanceRepository extends BaseRepository<Attendance> {
    constructor() {
        super('tbl_attendance');
    }

    async findAll(): Promise<Attendance[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY date DESC, created_at DESC`);
        return result.rows.map((row) => this.mapRowToAttendance(row));
    }

    async findById(id: number): Promise<Attendance | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.rows.length > 0 ? this.mapRowToAttendance(result.rows[0]) : null;
    }

    async findByEmployeeId(employeeId: number): Promise<Attendance[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE employee_id = ? ORDER BY date DESC`,
            [employeeId]
        );
        return result.rows.map((row) => this.mapRowToAttendance(row));
    }

    async findByEmployeeAndDate(employeeId: number, date: Date): Promise<Attendance | null> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE employee_id = ? AND date = ?`,
            [employeeId, date]
        );
        return result.rows.length > 0 ? this.mapRowToAttendance(result.rows[0]) : null;
    }

    async create(data: Partial<IAttendance>): Promise<Attendance> {
        const ins = await this.query(
            `INSERT INTO ${this.tableName} (employee_id, date, check_in, check_out, status, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.employee_id!,
                data.date!,
                data.check_in || null,
                data.check_out || null,
                data.status || AttendanceStatus.PRESENT,
                data.notes || null,
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create attendance record');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToAttendance(fetched.rows[0]);
    }

    async update(id: number, data: Partial<IAttendance>): Promise<Attendance | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.date !== undefined) {
            updates.push(`date = ?`);
            values.push(data.date);
        }
        if (data.check_in !== undefined) {
            updates.push(`check_in = ?`);
            values.push(data.check_in);
        }
        if (data.check_out !== undefined) {
            updates.push(`check_out = ?`);
            values.push(data.check_out);
        }
        if (data.status !== undefined) {
            updates.push(`status = ?`);
            values.push(data.status);
        }
        if (data.notes !== undefined) {
            updates.push(`notes = ?`);
            values.push(data.notes);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async getAttendanceStats(employeeId: number): Promise<{
        present: number;
        absent: number;
        total: number;
    }> {
        const result = await this.query(
            `SELECT 
                SUM(CASE WHEN status IN ('present', 'late', 'half-day') THEN 1 ELSE 0 END) AS present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent,
                COUNT(*) AS total
             FROM ${this.tableName}
             WHERE employee_id = ?`,
            [employeeId]
        );
        const row = result.rows[0];
        return {
            present: parseInt(String(row.present), 10) || 0,
            absent: parseInt(String(row.absent), 10) || 0,
            total: parseInt(String(row.total), 10) || 0,
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
