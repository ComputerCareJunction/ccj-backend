"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const AttendanceRepository_1 = require("../repositories/AttendanceRepository");
class AttendanceService {
    constructor() {
        this.attendanceRepository = new AttendanceRepository_1.AttendanceRepository();
    }
    async getAllAttendance() {
        return await this.attendanceRepository.findAll();
    }
    async getAttendanceById(id) {
        return await this.attendanceRepository.findById(id);
    }
    async getAttendanceByEmployeeId(employeeId) {
        return await this.attendanceRepository.findByEmployeeId(employeeId);
    }
    async getAttendanceStats(employeeId) {
        return await this.attendanceRepository.getAttendanceStats(employeeId);
    }
    async createAttendance(data) {
        return await this.attendanceRepository.create(data);
    }
    async updateAttendance(id, data) {
        return await this.attendanceRepository.update(id, data);
    }
    async deleteAttendance(id) {
        return await this.attendanceRepository.delete(id);
    }
}
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=AttendanceService.js.map