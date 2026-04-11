"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmployeeController_1 = require("../controllers/EmployeeController");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const DashboardPermission_1 = require("../models/DashboardPermission");
const router = (0, express_1.Router)();
const employeeController = new EmployeeController_1.EmployeeController();
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Get all employees
router.get('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), employeeController.getAllEmployees);
// Get employee by email (query parameter)
router.get('/by-email', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), employeeController.getEmployeeByEmail);
// Get employee by ID
router.get('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), employeeController.getEmployeeById);
// Create employee
router.post('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.CREATE), employeeController.createEmployee);
// Update employee
router.put('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.UPDATE), employeeController.updateEmployee);
// Delete employee
router.delete('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.DELETE), employeeController.deleteEmployee);
// Sync users to employees
router.post('/sync-users', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.CREATE), employeeController.syncUsersToEmployees);
exports.default = router;
//# sourceMappingURL=employees.routes.js.map