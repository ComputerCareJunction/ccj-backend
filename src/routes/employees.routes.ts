import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware } from '../middleware/auth';
import { permissionMiddleware } from '../middleware/permissions';
import { DashboardSection, PermissionAction } from '../models/DashboardPermission';

const router = Router();
const employeeController = new EmployeeController();

// All routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     description: Retrieve all employees (requires view permission)
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a new employee
 *     description: Add a new employee to the system
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
    '/',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    employeeController.getAllEmployees
);

/**
 * @swagger
 * /api/employees/by-email:
 *   get:
 *     summary: Get employee by email
 *     description: Retrieve employee by email address
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee email
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/by-email',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    employeeController.getEmployeeByEmail
);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Retrieve a specific employee by ID
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update employee
 *     description: Update employee information
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete employee
 *     description: Delete an employee
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    employeeController.getEmployeeById
);

router.post(
    '/',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.CREATE),
    employeeController.createEmployee
);

router.put(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.UPDATE),
    employeeController.updateEmployee
);

router.delete(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.DELETE),
    employeeController.deleteEmployee
);

/**
 * @swagger
 * /api/employees/sync-users:
 *   post:
 *     summary: Sync users to employees
 *     description: Synchronize registered users to employees table
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users synced successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
    '/sync-users',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.CREATE),
    employeeController.syncUsersToEmployees
);

export default router;

