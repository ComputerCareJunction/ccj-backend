"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AttendanceController_1 = require("../controllers/AttendanceController");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const DashboardPermission_1 = require("../models/DashboardPermission");
const router = (0, express_1.Router)();
const attendanceController = new AttendanceController_1.AttendanceController();
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Get all attendance records
router.get('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), attendanceController.getAllAttendance);
// Get attendance by employee ID
router.get('/employee/:employeeId', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), attendanceController.getAttendanceByEmployeeId);
// Get attendance stats for employee
router.get('/employee/:employeeId/stats', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), attendanceController.getAttendanceStats);
// Get attendance by ID
router.get('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.VIEW), attendanceController.getAttendanceById);
// Create attendance
router.post('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.CREATE), attendanceController.createAttendance);
// Update attendance
router.put('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.UPDATE), attendanceController.updateAttendance);
// Delete attendance
router.delete('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.EMPLOYEES, DashboardPermission_1.PermissionAction.DELETE), attendanceController.deleteAttendance);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map