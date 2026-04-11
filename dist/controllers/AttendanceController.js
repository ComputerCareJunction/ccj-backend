"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const AttendanceService_1 = require("../services/AttendanceService");
class AttendanceController {
    constructor() {
        this.getAllAttendance = async (req, res) => {
            try {
                const attendance = await this.attendanceService.getAllAttendance();
                res.json({ success: true, data: attendance });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
            }
        };
        this.getAttendanceById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const attendance = await this.attendanceService.getAttendanceById(id);
                if (!attendance) {
                    res.status(404).json({ error: 'Attendance record not found' });
                    return;
                }
                res.json({ success: true, data: attendance });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
            }
        };
        this.getAttendanceByEmployeeId = async (req, res) => {
            try {
                const employeeId = parseInt(req.params.employeeId);
                const attendance = await this.attendanceService.getAttendanceByEmployeeId(employeeId);
                res.json({ success: true, data: attendance });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
            }
        };
        this.getAttendanceStats = async (req, res) => {
            try {
                const employeeId = parseInt(req.params.employeeId);
                const stats = await this.attendanceService.getAttendanceStats(employeeId);
                res.json({ success: true, data: stats });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch attendance stats' });
            }
        };
        this.createAttendance = async (req, res) => {
            try {
                const attendance = await this.attendanceService.createAttendance(req.body);
                res.status(201).json({ success: true, data: attendance });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to create attendance' });
            }
        };
        this.updateAttendance = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const attendance = await this.attendanceService.updateAttendance(id, req.body);
                if (!attendance) {
                    res.status(404).json({ error: 'Attendance record not found' });
                    return;
                }
                res.json({ success: true, data: attendance });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to update attendance' });
            }
        };
        this.deleteAttendance = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const success = await this.attendanceService.deleteAttendance(id);
                if (!success) {
                    res.status(404).json({ error: 'Attendance record not found' });
                    return;
                }
                res.json({ success: true, message: 'Attendance record deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to delete attendance' });
            }
        };
        this.attendanceService = new AttendanceService_1.AttendanceService();
    }
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=AttendanceController.js.map