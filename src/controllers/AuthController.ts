import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { PasswordResetService } from '../services/PasswordResetService';
import { UserRole } from '../models/User';

export class AuthController {
    private authService: AuthService;
    private passwordResetService: PasswordResetService;

    constructor() {
        this.authService = new AuthService();
        this.passwordResetService = new PasswordResetService();
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const { user, token } = await this.authService.login({ email, password });
            res.json({
                success: true,
                token,
                user: user.toPublicJSON(),
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Login failed' });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, phone } = req.body;

            if (!name || !email || !password || !phone) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            const user = await this.authService.register({ name, email, password, phone });
            res.status(201).json({
                success: true,
                user: user.toPublicJSON(),
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Registration failed' });
        }
    };

    getProfile = async (req: any, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            // Get full user details from database
            const { UserRepository } = await import('../repositories/UserRepository');
            const userRepository = new UserRepository();
            const user = await userRepository.findById(req.user.userId);
            
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({
                success: true,
                user: user.toPublicJSON(),
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to get profile' });
        }
    };

    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }
            await this.passwordResetService.requestForgotPasswordOtp(email);
            res.json({
                success: true,
                message: 'Verification code sent to your email.',
            });
        } catch (error: any) {
            const status = typeof error.status === 'number' ? error.status : 400;
            res.status(status).json({ error: error.message || 'Failed to send verification code' });
        }
    };

    verifyForgotPasswordOtp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp } = req.body;
            if (!email || otp === undefined || otp === null || otp === '') {
                res.status(400).json({ error: 'Email and verification code are required' });
                return;
            }
            const { resetToken } = await this.passwordResetService.verifyOtpAndIssueResetToken(
                email,
                String(otp)
            );
            res.json({ success: true, resetToken });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Verification failed' });
        }
    };

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { resetToken, newPassword, confirmPassword } = req.body;
            if (!resetToken || !newPassword || confirmPassword === undefined || confirmPassword === null) {
                res.status(400).json({
                    error: 'resetToken, newPassword, and confirmPassword are required',
                });
                return;
            }
            await this.passwordResetService.resetPasswordWithToken(
                resetToken,
                newPassword,
                confirmPassword
            );
            res.json({ success: true, message: 'Password changed successfully' });
        } catch (error: any) {
            const msg = error.message || 'Failed to reset password';
            const isToken =
                typeof msg === 'string' &&
                (msg.includes('reset token') || msg.includes('jwt') || msg.includes('expired'));
            res.status(isToken ? 401 : 400).json({ error: msg });
        }
    };
}

