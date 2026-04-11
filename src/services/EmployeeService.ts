import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { Employee, IEmployee, EmployeeStatus } from '../models/Employee';

export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    async getAllEmployees(): Promise<Employee[]> {
        const employees = await this.employeeRepository.findAll();
        // Filter out employees that correspond to inactive users
        const { UserRepository } = await import('../repositories/UserRepository');
        const userRepository = new UserRepository();
        const users = await userRepository.findAll();
        
        const inactiveUserEmails = new Set(
            users
                .filter(user => user.status === 'inactive')
                .map(user => user.email.toLowerCase())
        );
        
        // Return only employees that don't match inactive users
        return employees.filter(emp => !inactiveUserEmails.has(emp.email.toLowerCase()));
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        return await this.employeeRepository.findById(id);
    }

    async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
        return await this.employeeRepository.findByEmployeeId(employeeId);
    }

    async getEmployeeByEmail(email: string): Promise<Employee | null> {
        return await this.employeeRepository.findByEmail(email);
    }

    async createEmployee(data: Partial<IEmployee>): Promise<Employee> {
        return await this.employeeRepository.create(data);
    }

    async updateEmployee(id: number, data: Partial<IEmployee>): Promise<Employee | null> {
        return await this.employeeRepository.update(id, data);
    }

    async deleteEmployee(id: number): Promise<boolean> {
        return await this.employeeRepository.delete(id);
    }

    async syncUsersToEmployees(): Promise<{ created: number; updated: number; errors: string[] }> {
        const { UserRepository } = await import('../repositories/UserRepository');
        const userRepository = new UserRepository();
        
        const users = await userRepository.findAll();
        
        const created: number[] = [];
        const updated: number[] = [];
        const errors: string[] = [];

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
                        status: EmployeeStatus.ACTIVE, // Ensure active status
                    });
                    updated.push(existingEmployee.id);
                } else {
                    // Create new employee from user (only for active users)
                    try {
                        const newEmployee = await this.employeeRepository.create({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || undefined,
                            position: 'Staff',
                            department: 'General',
                            hire_date: user.created_at ? new Date(user.created_at) : new Date(),
                            status: EmployeeStatus.ACTIVE,
                        });
                        if (newEmployee.id) {
                            created.push(newEmployee.id);
                        }
                    } catch (createError: any) {
                        // If creation fails due to duplicate employee_id, try to find and update by email
                        if (createError.message && createError.message.includes('employee_id_key')) {
                            // Try to find by email in case employee was created in another transaction
                            const existingByEmail = await this.employeeRepository.findByEmail(user.email);
                            if (existingByEmail && existingByEmail.id) {
                                await this.employeeRepository.update(existingByEmail.id, {
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone || undefined,
                                    status: EmployeeStatus.ACTIVE,
                                });
                                updated.push(existingByEmail.id);
                            } else {
                                // If still not found, it's a genuine duplicate ID error
                                errors.push(`Failed to sync user ${user.email}: Duplicate employee_id generated. Please try again.`);
                            }
                        } else {
                            throw createError; // Re-throw other errors
                        }
                    }
                }
            } catch (error: any) {
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

