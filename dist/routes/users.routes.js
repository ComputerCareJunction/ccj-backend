"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const DashboardPermission_1 = require("../models/DashboardPermission");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Get all users - requires admin or view permission
router.get('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.VIEW), userController.getAllUsers);
// Get sub-users - requires admin
router.get('/sub-users', auth_1.authMiddleware.requireAdmin, userController.getSubUsers);
// Get user by ID
router.get('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.VIEW), userController.getUserById);
// Create user - requires create permission
router.post('/', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.CREATE), userController.createUser);
// Update user - requires update permission
router.put('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.UPDATE), userController.updateUser);
// Delete user - requires delete permission
router.delete('/:id', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.DELETE), userController.deleteUser);
// Change password - requires update permission
router.put('/:id/change-password', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.UPDATE), userController.changePassword);
// Activate user - requires update permission
router.put('/:id/activate', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.UPDATE), userController.activateUser);
// Deactivate user - requires delete permission
router.put('/:id/deactivate', permissions_1.permissionMiddleware.checkPermission(DashboardPermission_1.DashboardSection.USERS, DashboardPermission_1.PermissionAction.DELETE), userController.deactivateUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map