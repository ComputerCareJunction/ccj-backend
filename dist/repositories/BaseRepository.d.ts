import { Pool, QueryResult } from 'pg';
export declare abstract class BaseRepository<T> {
    protected pool: Pool;
    protected tableName: string;
    constructor(tableName: string);
    protected query(text: string, params?: any[]): Promise<QueryResult>;
    abstract findAll(): Promise<T[]>;
    abstract findById(id: number): Promise<T | null>;
    abstract create(data: Partial<T>): Promise<T>;
    abstract update(id: number, data: Partial<T>): Promise<T | null>;
    abstract delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=BaseRepository.d.ts.map