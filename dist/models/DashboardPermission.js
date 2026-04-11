"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPermission = exports.PermissionAction = exports.DashboardSection = void 0;
var DashboardSection;
(function (DashboardSection) {
    DashboardSection["PRODUCTS"] = "products";
    DashboardSection["USERS"] = "users";
    DashboardSection["BLOGS"] = "blogs";
    DashboardSection["EMPLOYEES"] = "employees";
})(DashboardSection || (exports.DashboardSection = DashboardSection = {}));
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["VIEW"] = "view";
    PermissionAction["CREATE"] = "create";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
class DashboardPermission {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.section = data.section;
        this.can_view = data.can_view;
        this.can_create = data.can_create;
        this.can_update = data.can_update;
        this.can_delete = data.can_delete;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
    hasPermission(action) {
        switch (action) {
            case PermissionAction.VIEW:
                return this.can_view;
            case PermissionAction.CREATE:
                return this.can_create;
            case PermissionAction.UPDATE:
                return this.can_update;
            case PermissionAction.DELETE:
                return this.can_delete;
            default:
                return false;
        }
    }
}
exports.DashboardPermission = DashboardPermission;
//# sourceMappingURL=DashboardPermission.js.map