"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const EmployeeService_1 = require("../services/EmployeeService");
class EmployeeController {
    constructor() {
        this.getAllEmployees = async (req, res) => {
            try {
                const employees = await this.employeeService.getAllEmployees();
                res.json({ success: true, data: employees });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch employees' });
            }
        };
        this.getEmployeeById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const employee = await this.employeeService.getEmployeeById(id);
                if (!employee) {
                    res.status(404).json({ error: 'Employee not found' });
                    return;
                }
                res.json({ success: true, data: employee });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch employee' });
            }
        };
        this.getEmployeeByEmail = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch employee' });
            }
        };
        this.createEmployee = async (req, res) => {
            try {
                const employee = await this.employeeService.createEmployee(req.body);
                res.status(201).json({ success: true, data: employee });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to create employee' });
            }
        };
        this.updateEmployee = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const employee = await this.employeeService.updateEmployee(id, req.body);
                if (!employee) {
                    res.status(404).json({ error: 'Employee not found' });
                    return;
                }
                res.json({ success: true, data: employee });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to update employee' });
            }
        };
        this.deleteEmployee = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const success = await this.employeeService.deleteEmployee(id);
                if (!success) {
                    res.status(404).json({ error: 'Employee not found' });
                    return;
                }
                res.json({ success: true, message: 'Employee deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to delete employee' });
            }
        };
        this.syncUsersToEmployees = async (req, res) => {
            try {
                const result = await this.employeeService.syncUsersToEmployees();
                res.json({
                    success: true,
                    message: `Sync completed: ${result.created} created, ${result.updated} updated`,
                    data: result,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to sync users to employees' });
            }
        };
        this.employeeService = new EmployeeService_1.EmployeeService();
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=EmployeeController.js.map