"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PermissionController_1 = require("../controllers/PermissionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const permissionController = new PermissionController_1.PermissionController();
// All routes require authentication and admin role
router.use(auth_1.authMiddleware.authenticate);
router.use(auth_1.authMiddleware.requireAdmin);
// Get user permissions
router.get('/:userId', permissionController.getUserPermissions);
// Set permission for a user
router.post('/:userId', permissionController.setPermission);
// Set all permissions for a user
router.post('/:userId/all', permissionController.setAllPermissions);
// Delete all permissions for a user
router.delete('/:userId', permissionController.deleteUserPermissions);
exports.default = router;
//# sourceMappingURL=permissions.routes.js.map