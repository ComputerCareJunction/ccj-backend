import { Pool, QueryResult } from 'pg';
import db from '../config/database';

export abstract class BaseRepository<T> {
    protected pool: Pool;
    protected tableName: string;

    constructor(tableName: string) {
        this.pool = db.getPool();
        this.tableName = tableName;
    }

    protected async query(text: string, params?: any[]): Promise<QueryResult> {
        return await this.pool.query(text, params);
    }

    public abstract findAll(): Promise<T[]>;
    public abstract findById(id: number): Promise<T | null>;
    public abstract create(data: Partial<T>): Promise<T>;
    public abstract update(id: number, data: Partial<T>): Promise<T | null>;
    public abstract delete(id: number): Promise<boolean>;
}

