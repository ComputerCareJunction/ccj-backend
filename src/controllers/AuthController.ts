import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRole } from '../models/User';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
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
}

