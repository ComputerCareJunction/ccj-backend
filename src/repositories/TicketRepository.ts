import { BaseRepository } from './BaseRepository';
import { Ticket, ITicket } from '../models/Ticket';

export class TicketRepository extends BaseRepository<Ticket> {
    constructor() {
        super('tbl_tickets');
    }

    async findAll(): Promise<Ticket[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToTicket(row));
    }

    async findById(id: number): Promise<Ticket | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToTicket(result.rows[0]) : null;
    }

    async create(data: Partial<ITicket>): Promise<Ticket> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (ticket_name, ticket_type, requested_by, phone_number, message, status, priority)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                data.ticket_name,
                data.ticket_type,
                data.requested_by,
                data.phone_number,
                data.message,
                data.status || 'todo',
                data.priority || 'high',
            ]
        );
        return this.mapRowToTicket(result.rows[0]);
    }

    async update(id: number, data: Partial<ITicket>): Promise<Ticket | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.ticket_name !== undefined) {
            updates.push(`ticket_name = $${paramCount++}`);
            values.push(data.ticket_name);
        }
        if (data.ticket_type !== undefined) {
            updates.push(`ticket_type = $${paramCount++}`);
            values.push(data.ticket_type);
        }
        if (data.requested_by !== undefined) {
            updates.push(`requested_by = $${paramCount++}`);
            values.push(data.requested_by);
        }
        if (data.phone_number !== undefined) {
            updates.push(`phone_number = $${paramCount++}`);
            values.push(data.phone_number);
        }
        if (data.message !== undefined) {
            updates.push(`message = $${paramCount++}`);
            values.push(data.message);
        }
        if (data.status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(data.status);
        }
        if (data.priority !== undefined) {
            updates.push(`priority = $${paramCount++}`);
            values.push(data.priority);
        }

        if (updates.length === 0) {
            return await this.findById(id);
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const result = await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows.length > 0 ? this.mapRowToTicket(result.rows[0]) : null;
    }

    async updateStatus(id: number, status: 'todo' | 'in_progress' | 'done' | 'closed'): Promise<Ticket | null> {
        const result = await this.query(
            `UPDATE ${this.tableName} SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows.length > 0 ? this.mapRowToTicket(result.rows[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rowCount ? result.rowCount > 0 : false;
    }

    private mapRowToTicket(row: any): Ticket {
        return new Ticket({
            id: row.id,
            ticket_name: row.ticket_name,
            ticket_type: row.ticket_type,
            requested_by: row.requested_by,
            phone_number: row.phone_number,
            message: row.message,
            status: row.status,
            priority: row.priority,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}

