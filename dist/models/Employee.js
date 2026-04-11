"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = exports.EmployeeStatus = void 0;
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "active";
    EmployeeStatus["INACTIVE"] = "inactive";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
class Employee {
    constructor(data) {
        this.id = data.id;
        this.employee_id = data.employee_id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.position = data.position;
        this.department = data.department;
        this.hire_date = data.hire_date;
        this.status = data.status;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Employee = Employee;
//# sourceMappingURL=Employee.js.map