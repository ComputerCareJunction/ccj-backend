"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const PermissionService_1 = require("../services/PermissionService");
const DashboardPermission_1 = require("../models/DashboardPermission");
class PermissionController {
    constructor() {
        this.getUserPermissions = async (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                const permissions = await this.permissionService.getUserPermissions(userId);
                res.json({ success: true, data: permissions });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch permissions' });
            }
        };
        this.setPermission = async (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                const { section, can_view, can_create, can_update, can_delete } = req.body;
                if (!section || !Object.values(DashboardPermission_1.DashboardSection).includes(section)) {
                    res.status(400).json({ error: 'Valid section is required' });
                    return;
                }
                const permission = await this.permissionService.setPermission(userId, section, {
                    can_view: can_view ?? false,
                    can_create: can_create ?? false,
                    can_update: can_update ?? false,
                    can_delete: can_delete ?? false,
                });
                res.json({ success: true, data: permission });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to set permission' });
            }
        };
        this.setAllPermissions = async (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                const { permissions } = req.body;
                if (!Array.isArray(permissions)) {
                    res.status(400).json({ error: 'Permissions array is required' });
                    return;
                }
                const result = await this.permissionService.setAllPermissions(userId, permissions);
                res.json({ success: true, data: result });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to set permissions' });
            }
        };
        this.deleteUserPermissions = async (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                const success = await this.permissionService.deleteUserPermissions(userId);
                if (!success) {
                    res.status(404).json({ error: 'Permissions not found' });
                    return;
                }
                res.json({ success: true, message: 'Permissions deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to delete permissions' });
            }
        };
        this.permissionService = new PermissionService_1.PermissionService();
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=PermissionController.js.map