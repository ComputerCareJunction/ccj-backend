"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = exports.AttendanceStatus = void 0;
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["HALF_DAY"] = "half-day";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
class Attendance {
    constructor(data) {
        this.id = data.id;
        this.employee_id = data.employee_id;
        this.date = data.date;
        this.check_in = data.check_in;
        this.check_out = data.check_out;
        this.status = data.status;
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Attendance = Attendance;
//# sourceMappingURL=Attendance.js.map