"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const User_1 = require("../models/User");
const AuthService_1 = require("./AuthService");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.authService = new AuthService_1.AuthService();
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    async getAllActiveUsers() {
        return await this.userRepository.findAllActive();
    }
    async getAllInactiveUsers() {
        return await this.userRepository.findAllInactive();
    }
    async activateUser(id) {
        return await this.userRepository.update(id, { status: User_1.UserStatus.ACTIVE });
    }
    async deactivateUser(id) {
        return await this.userRepository.update(id, { status: User_1.UserStatus.INACTIVE });
    }
    async getUserById(id) {
        return await this.userRepository.findById(id);
    }
    async createUser(data) {
        if (data.password) {
            data.password = await this.authService.hashPassword(data.password);
        }
        return await this.userRepository.create(data);
    }
    async updateUser(id, data) {
        if (data.password) {
            data.password = await this.authService.hashPassword(data.password);
        }
        return await this.userRepository.update(id, data);
    }
    async deleteUser(id) {
        return await this.userRepository.delete(id);
    }
    async getSubUsers() {
        return await this.userRepository.findSubUsers();
    }
    async changePassword(userId, newPassword) {
        const hashedPassword = await this.authService.hashPassword(newPassword);
        return await this.userRepository.updatePassword(userId, hashedPassword);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map