import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import db from '../config/database';

/** Normalized query result (similar shape to node-pg for callers). */
export interface RepositoryQueryResult {
    rows: RowDataPacket[];
    rowCount?: number;
    insertId?: number;
}

export abstract class BaseRepository<T> {
    protected pool: Pool;
    protected tableName: string;

    constructor(tableName: string) {
        this.pool = db.getPool();
        this.tableName = tableName;
    }

    protected async query(text: string, params: any[] = []): Promise<RepositoryQueryResult> {
        const [result] = await this.pool.execute(text, params);
        if (Array.isArray(result)) {
            const rows = result as RowDataPacket[];
            return { rows, rowCount: rows.length };
        }
        const header = result as ResultSetHeader;
        return {
            rows: [],
            rowCount: header.affectedRows,
            insertId: header.insertId,
        };
    }

    /** Load row by primary key after INSERT ... with auto-increment id. */
    protected async selectByIdAfterInsert(insertId: number): Promise<RepositoryQueryResult> {
        return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [insertId]);
    }

    public abstract findAll(): Promise<T[]>;
    public abstract findById(id: number): Promise<T | null>;
    public abstract create(data: Partial<T>): Promise<T>;
    public abstract update(id: number, data: Partial<T>): Promise<T | null>;
    public abstract delete(id: number): Promise<boolean>;
}
