"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.getAllUsers = async (req, res) => {
            try {
                const { status } = req.query;
                let users;
                if (status === 'active') {
                    users = await this.userService.getAllActiveUsers();
                }
                else if (status === 'inactive') {
                    users = await this.userService.getAllInactiveUsers();
                }
                else {
                    users = await this.userService.getAllUsers();
                }
                res.json({ success: true, data: users });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch users' });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const user = await this.userService.getUserById(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({ success: true, data: user });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch user' });
            }
        };
        this.createUser = async (req, res) => {
            try {
                const user = await this.userService.createUser(req.body);
                res.status(201).json({ success: true, data: user });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to create user' });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const user = await this.userService.updateUser(id, req.body);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({ success: true, data: user });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to update user' });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                // Soft delete: deactivate user
                const user = await this.userService.deactivateUser(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({ success: true, message: 'User deactivated successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to deactivate user' });
            }
        };
        this.activateUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const user = await this.userService.activateUser(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({ success: true, message: 'User activated successfully', data: user });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to activate user' });
            }
        };
        this.deactivateUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const user = await this.userService.deactivateUser(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({ success: true, message: 'User deactivated successfully', data: user });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to deactivate user' });
            }
        };
        this.getSubUsers = async (req, res) => {
            try {
                const users = await this.userService.getSubUsers();
                res.json({ success: true, data: users });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch sub-users' });
            }
        };
        this.changePassword = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to change password' });
            }
        };
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map