import { Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { AuthenticatedRequest } from '../middleware/auth';

export class EmployeeController {
    private employeeService: EmployeeService;

    constructor() {
        this.employeeService = new EmployeeService();
    }

    getAllEmployees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.json({ success: true, data: employees });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch employees' });
        }
    };

    getEmployeeById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const employee = await this.employeeService.getEmployeeById(id);
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ success: true, data: employee });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch employee' });
        }
    };

    getEmployeeByEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                res.status(400).json({ error: 'Email parameter is required' });
                return;
            }
            const employee = await this.employeeService.getEmployeeByEmail(email);
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ success: true, data: employee });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch employee' });
        }
    };

    createEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const employee = await this.employeeService.createEmployee(req.body);
            res.status(201).json({ success: true, data: employee });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create employee' });
        }
    };

    updateEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const employee = await this.employeeService.updateEmployee(id, req.body);
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ success: true, data: employee });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update employee' });
        }
    };

    deleteEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.employeeService.deleteEmployee(id);
            if (!success) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ success: true, message: 'Employee deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete employee' });
        }
    };

    syncUsersToEmployees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const result = await this.employeeService.syncUsersToEmployees();
            res.json({
                success: true,
                message: `Sync completed: ${result.created} created, ${result.updated} updated`,
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to sync users to employees' });
        }
    };
}

