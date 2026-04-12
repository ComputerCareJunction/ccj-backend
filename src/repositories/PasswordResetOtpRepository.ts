import { RowDataPacket } from 'mysql2';
import db from '../config/database';

export interface PasswordResetOtpRow {
    id: number;
    email: string;
    otp_hash: string;
    expires_at: Date;
    created_at: Date;
}

const TABLE = 'tbl_password_reset_otps';

export class PasswordResetOtpRepository {
    private pool = db.getPool();

    async deleteByEmail(email: string): Promise<void> {
        await this.pool.execute(`DELETE FROM ${TABLE} WHERE email = ?`, [email]);
    }

    async insert(email: string, otpHash: string, expiresAt: Date): Promise<void> {
        await this.pool.execute(
            `INSERT INTO ${TABLE} (email, otp_hash, expires_at) VALUES (?, ?, ?)`,
            [email, otpHash, expiresAt]
        );
    }

    async findLatestByEmail(email: string): Promise<PasswordResetOtpRow | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, email, otp_hash, expires_at, created_at FROM ${TABLE} WHERE email = ? ORDER BY id DESC LIMIT 1`,
            [email]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return {
            id: r.id,
            email: r.email,
            otp_hash: r.otp_hash,
            expires_at: r.expires_at,
            created_at: r.created_at,
        };
    }

    async deleteById(id: number): Promise<void> {
        await this.pool.execute(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
    }
}
