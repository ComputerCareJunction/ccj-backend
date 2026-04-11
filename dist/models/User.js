"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SUB_USER"] = "sub_user";
    UserRole["CUSTOMER"] = "customer";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.role = data.role;
        this.status = data.status;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
    toPublicJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            role: this.role,
            status: this.status,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map