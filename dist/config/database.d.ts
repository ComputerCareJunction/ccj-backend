import { Pool } from 'pg';
declare class DatabaseConfig {
    private pool;
    constructor();
    getPool(): Pool;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
}
declare const _default: DatabaseConfig;
export default _default;
//# sourceMappingURL=database.d.ts.map