import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authMiddleware } from '../middleware/auth';
import { permissionMiddleware } from '../middleware/permissions';
import { DashboardSection, PermissionAction } from '../models/DashboardPermission';

const router = Router();
const attendanceController = new AttendanceController();

// All routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get all attendance records
 *     description: Retrieve all employee attendance records
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create attendance record
 *     description: Create a new attendance record
 *     tags:
 *       - Attendance
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
 *         description: Attendance record created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    '/',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    attendanceController.getAllAttendance
);

/**
 * @swagger
 * /api/attendance/employee/{employeeId}:
 *   get:
 *     summary: Get attendance by employee ID
 *     description: Get attendance records for a specific employee
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */
router.get(
    '/employee/:employeeId',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    attendanceController.getAttendanceByEmployeeId
);

/**
 * @swagger
 * /api/attendance/employee/{employeeId}/stats:
 *   get:
 *     summary: Get attendance stats for employee
 *     description: Get attendance statistics for a specific employee
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance stats retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */
router.get(
    '/employee/:employeeId/stats',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    attendanceController.getAttendanceStats
);

/**
 * @swagger
 * /api/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     description: Get a specific attendance record by ID
 *     tags:
 *       - Attendance
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
 *         description: Attendance record retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attendance record not found
 *   put:
 *     summary: Update attendance record
 *     description: Update an attendance record
 *     tags:
 *       - Attendance
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
 *         description: Attendance record updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attendance record not found
 *   delete:
 *     summary: Delete attendance record
 *     description: Delete an attendance record
 *     tags:
 *       - Attendance
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
 *         description: Attendance record deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attendance record not found
 */
router.get(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.VIEW),
    attendanceController.getAttendanceById
);

router.post(
    '/',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.CREATE),
    attendanceController.createAttendance
);

router.put(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.UPDATE),
    attendanceController.updateAttendance
);

router.delete(
    '/:id',
    permissionMiddleware.checkPermission(DashboardSection.EMPLOYEES, PermissionAction.DELETE),
    attendanceController.deleteAttendance
);

export default router;

