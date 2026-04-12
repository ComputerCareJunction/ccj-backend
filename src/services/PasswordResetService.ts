import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordResetOtpRepository } from '../repositories/PasswordResetOtpRepository';
import { EmailService } from './EmailService';
import { AuthService } from './AuthService';
import { EnvironmentConfig } from '../config/env';

const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

export class PasswordResetService {
    private userRepository: UserRepository;
    private otpRepository: PasswordResetOtpRepository;
    private emailService: EmailService;
    private authService: AuthService;

    constructor() {
        this.userRepository = new UserRepository();
        this.otpRepository = new PasswordResetOtpRepository();
        this.emailService = new EmailService();
        this.authService = new AuthService();
    }

    private normalizeEmail(raw: string): string {
        return String(raw ?? '').trim().toLowerCase();
    }

    async requestForgotPasswordOtp(rawEmail: string): Promise<void> {
        const email = this.normalizeEmail(rawEmail);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Valid email is required');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user?.id) {
            const err = new Error('No account found for this email address') as Error & { status?: number };
            err.status = 404;
            throw err;
        }

        const latest = await this.otpRepository.findLatestByEmail(email);
        if (latest?.created_at) {
            const elapsed = Date.now() - new Date(latest.created_at).getTime();
            if (elapsed < RESEND_COOLDOWN_MS) {
                throw new Error('Please wait a minute before requesting a new code');
            }
        }

        await this.otpRepository.deleteByEmail(email);

        const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
        const otpHash = await this.authService.hashPassword(otp);
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);
        await this.otpRepository.insert(email, otpHash, expiresAt);

        await this.emailService.sendPasswordResetOtp(email, otp);

        if (EnvironmentConfig.NODE_ENV === 'development') {
            console.log(`[dev] Password reset OTP for ${email}: ${otp}`);
        }
    }

    async verifyOtpAndIssueResetToken(rawEmail: string, rawOtp: string): Promise<{ resetToken: string }> {
        const email = this.normalizeEmail(rawEmail);
        const otp = String(rawOtp ?? '')
            .replace(/\D/g, '')
            .slice(0, 6);
        if (!email || otp.length !== 6) {
            throw new Error('Invalid email or verification code');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user?.id) {
            throw new Error('Invalid email or verification code');
        }

        const row = await this.otpRepository.findLatestByEmail(email);
        if (!row) {
            throw new Error('Invalid or expired verification code');
        }
        if (new Date(row.expires_at).getTime() < Date.now()) {
            await this.otpRepository.deleteById(row.id);
            throw new Error('Invalid or expired verification code');
        }

        const match = await this.authService.verifyPassword(otp, row.otp_hash);
        if (!match) {
            throw new Error('Invalid email or verification code');
        }

        await this.otpRepository.deleteById(row.id);
        const resetToken = this.authService.generatePasswordResetToken(user.id!, email);
        return { resetToken };
    }

    async resetPasswordWithToken(
        resetToken: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<void> {
        if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
            throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        }
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const { userId } = this.authService.verifyPasswordResetToken(resetToken);
        const hashed = await this.authService.hashPassword(newPassword);
        const updated = await this.userRepository.updatePassword(userId, hashed);
        if (!updated) {
            throw new Error('User not found');
        }
    }
}
