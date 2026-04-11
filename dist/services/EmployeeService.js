"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const EmployeeRepository_1 = require("../repositories/EmployeeRepository");
const Employee_1 = require("../models/Employee");
class EmployeeService {
    constructor() {
        this.employeeRepository = new EmployeeRepository_1.EmployeeRepository();
    }
    async getAllEmployees() {
        const employees = await this.employeeRepository.findAll();
        // Filter out employees that correspond to inactive users
        const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/UserRepository')));
        const userRepository = new UserRepository();
        const users = await userRepository.findAll();
        const inactiveUserEmails = new Set(users
            .filter(user => user.status === 'inactive')
            .map(user => user.email.toLowerCase()));
        // Return only employees that don't match inactive users
        return employees.filter(emp => !inactiveUserEmails.has(emp.email.toLowerCase()));
    }
    async getEmployeeById(id) {
        return await this.employeeRepository.findById(id);
    }
    async getEmployeeByEmployeeId(employeeId) {
        return await this.employeeRepository.findByEmployeeId(employeeId);
    }
    async getEmployeeByEmail(email) {
        return await this.employeeRepository.findByEmail(email);
    }
    async createEmployee(data) {
        return await this.employeeRepository.create(data);
    }
    async updateEmployee(id, data) {
        return await this.employeeRepository.update(id, data);
    }
    async deleteEmployee(id) {
        return await this.employeeRepository.delete(id);
    }
    async syncUsersToEmployees() {
        const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/UserRepository')));
        const userRepository = new UserRepository();
        const users = await userRepository.findAll();
        const created = [];
        const updated = [];
        const errors = [];
        for (const user of users) {
            try {
                // Skip inactive users - don't sync them to employees
                if (user.status === 'inactive') {
                    // If employee exists for inactive user, delete it
                    const existingEmployee = await this.employeeRepository.findByEmail(user.email);
                    if (existingEmployee && existingEmployee.id) {
                        await this.employeeRepository.delete(existingEmployee.id);
                    }
                    continue;
                }
                // Always check database for existing employee by email
                const existingEmployee = await this.employeeRepository.findByEmail(user.email);
                if (existingEmployee && existingEmployee.id) {
                    // Update existing employee with user data
                    await this.employeeRepository.update(existingEmployee.id, {
                        name: user.name,
                        email: user.email,
                        phone: user.phone || undefined,
                        status: Employee_1.EmployeeStatus.ACTIVE, // Ensure active status
                    });
                    updated.push(existingEmployee.id);
                }
                else {
                    // Create new employee from user (only for active users)
                    try {
                        const newEmployee = await this.employeeRepository.create({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || undefined,
                            position: 'Staff',
                            department: 'General',
                            hire_date: user.created_at ? new Date(user.created_at) : new Date(),
                            status: Employee_1.EmployeeStatus.ACTIVE,
                        });
                        if (newEmployee.id) {
                            created.push(newEmployee.id);
                        }
                    }
                    catch (createError) {
                        // If creation fails due to duplicate employee_id, try to find and update by email
                        if (createError.message && createError.message.includes('employee_id_key')) {
                            // Try to find by email in case employee was created in another transaction
                            const existingByEmail = await this.employeeRepository.findByEmail(user.email);
                            if (existingByEmail && existingByEmail.id) {
                                await this.employeeRepository.update(existingByEmail.id, {
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone || undefined,
                                    status: Employee_1.EmployeeStatus.ACTIVE,
                                });
                                updated.push(existingByEmail.id);
                            }
                            else {
                                // If still not found, it's a genuine duplicate ID error
                                errors.push(`Failed to sync user ${user.email}: Duplicate employee_id generated. Please try again.`);
                            }
                        }
                        else {
                            throw createError; // Re-throw other errors
                        }
                    }
                }
            }
            catch (error) {
                errors.push(`Failed to sync user ${user.email}: ${error.message}`);
            }
        }
        return {
            created: created.length,
            updated: updated.length,
            errors,
        };
    }
}
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=EmployeeService.js.map