import { Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../middleware/auth';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { status } = req.query;
            let users;
            
            if (status === 'active') {
                users = await this.userService.getAllActiveUsers();
            } else if (status === 'inactive') {
                users = await this.userService.getAllInactiveUsers();
            } else {
                users = await this.userService.getAllUsers();
            }
            
            res.json({ success: true, data: users });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch users' });
        }
    };

    getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch user' });
        }
    };

    createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create user' });
        }
    };

    updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.updateUser(id, req.body);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update user' });
        }
    };

    deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            // Soft delete: deactivate user
            const user = await this.userService.deactivateUser(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, message: 'User deactivated successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to deactivate user' });
        }
    };

    activateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.activateUser(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, message: 'User activated successfully', data: user });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to activate user' });
        }
    };

    deactivateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.deactivateUser(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, message: 'User deactivated successfully', data: user });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to deactivate user' });
        }
    };

    getSubUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getSubUsers();
            res.json({ success: true, data: users });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch sub-users' });
        }
    };

    changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { password } = req.body;

            if (!password) {
                res.status(400).json({ error: 'Password is required' });
                return;
            }

            const user = await this.userService.changePassword(id, password);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ success: true, message: 'Password changed successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to change password' });
        }
    };
}

