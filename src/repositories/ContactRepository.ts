import { BaseRepository } from './BaseRepository';
import { Contact, IContact } from '../models/Contact';

export class ContactRepository extends BaseRepository<Contact> {
    constructor() {
        super('tbl_contact');
    }

    async findAll(): Promise<Contact[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToContact(row));
    }

    async findById(id: number): Promise<Contact | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToContact(result.rows[0]) : null;
    }

    async create(data: Partial<IContact>): Promise<Contact> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (name, email, phone, subject, looking_for, location, message, form_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                data.name,
                data.email,
                data.phone || null,
                data.subject || null,
                data.looking_for || null,
                data.location || null,
                data.message,
                data.form_type || 'contact',
            ]
        );
        return this.mapRowToContact(result.rows[0]);
    }

    async update(id: number, data: Partial<IContact>): Promise<Contact | null> {
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
        if (data.phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(data.phone);
        }
        if (data.subject !== undefined) {
            updates.push(`subject = $${paramCount++}`);
            values.push(data.subject);
        }
        if (data.looking_for !== undefined) {
            updates.push(`looking_for = $${paramCount++}`);
            values.push(data.looking_for);
        }
        if (data.location !== undefined) {
            updates.push(`location = $${paramCount++}`);
            values.push(data.location);
        }
        if (data.message !== undefined) {
            updates.push(`message = $${paramCount++}`);
            values.push(data.message);
        }
        if (data.form_type !== undefined) {
            updates.push(`form_type = $${paramCount++}`);
            values.push(data.form_type);
        }
        if (data.screening_status !== undefined) {
            updates.push(`screening_status = $${paramCount++}`);
            values.push(data.screening_status);
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

        return result.rows.length > 0 ? this.mapRowToContact(result.rows[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rowCount ? result.rowCount > 0 : false;
    }

    private mapRowToContact(row: any): Contact {
        return new Contact({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            subject: row.subject,
            looking_for: row.looking_for,
            location: row.location,
            message: row.message,
            form_type: row.form_type,
            screening_status: row.screening_status,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
