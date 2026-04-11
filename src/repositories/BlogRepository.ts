import { BaseRepository } from './BaseRepository';
import { Blog, IBlog } from '../models/Blog';
import { QueryResult } from 'pg';

export class BlogRepository extends BaseRepository<Blog> {
    constructor() {
        super('tbl_blogs');
    }

    async findAll(): Promise<Blog[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY date DESC, created_at DESC`);
        return result.rows.map(row => this.mapRowToBlog(row));
    }

    async findById(id: number): Promise<Blog | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToBlog(result.rows[0]) : null;
    }

    async create(data: Partial<IBlog>): Promise<Blog> {
        const result = await this.query(
            `INSERT INTO ${this.tableName} (title, content, description, author, date, image)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                data.title!,
                data.content!,
                data.description || null,
                data.author!,
                data.date!,
                data.image || null,
            ]
        );
        return this.mapRowToBlog(result.rows[0]);
    }

    async update(id: number, data: Partial<IBlog>): Promise<Blog | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(data.title);
        }
        if (data.content !== undefined) {
            updates.push(`content = $${paramCount++}`);
            values.push(data.content);
        }
        if (data.description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        if (data.author !== undefined) {
            updates.push(`author = $${paramCount++}`);
            values.push(data.author);
        }
        if (data.date !== undefined) {
            updates.push(`date = $${paramCount++}`);
            values.push(data.date);
        }
        if (data.image !== undefined) {
            updates.push(`image = $${paramCount++}`);
            values.push(data.image);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result = await this.query(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows.length > 0 ? this.mapRowToBlog(result.rows[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }

    private mapRowToBlog(row: any): Blog {
        return new Blog({
            id: row.id,
            title: row.title,
            content: row.content,
            description: row.description || row.excerpt, // Support both for migration compatibility
            author: row.author,
            date: new Date(row.date),
            image: row.image,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}

