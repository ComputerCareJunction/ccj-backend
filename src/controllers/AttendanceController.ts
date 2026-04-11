import { Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { AuthenticatedRequest } from '../middleware/auth';

export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        this.attendanceService = new AttendanceService();
    }

    getAllAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const attendance = await this.attendanceService.getAllAttendance();
            res.json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
        }
    };

    getAttendanceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const attendance = await this.attendanceService.getAttendanceById(id);
            if (!attendance) {
                res.status(404).json({ error: 'Attendance record not found' });
                return;
            }
            res.json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
        }
    };

    getAttendanceByEmployeeId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const attendance = await this.attendanceService.getAttendanceByEmployeeId(employeeId);
            res.json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
        }
    };

    getAttendanceStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const stats = await this.attendanceService.getAttendanceStats(employeeId);
            res.json({ success: true, data: stats });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch attendance stats' });
        }
    };

    createAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const attendance = await this.attendanceService.createAttendance(req.body);
            res.status(201).json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create attendance' });
        }
    };

    updateAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const attendance = await this.attendanceService.updateAttendance(id, req.body);
            if (!attendance) {
                res.status(404).json({ error: 'Attendance record not found' });
                return;
            }
            res.json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update attendance' });
        }
    };

    deleteAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.attendanceService.deleteAttendance(id);
            if (!success) {
                res.status(404).json({ error: 'Attendance record not found' });
                return;
            }
            res.json({ success: true, message: 'Attendance record deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete attendance' });
        }
    };
}

