import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class AttendanceController {
    private attendanceService;
    constructor();
    getAllAttendance: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getAttendanceById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getAttendanceByEmployeeId: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getAttendanceStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createAttendance: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateAttendance: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteAttendance: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=AttendanceController.d.ts.map