import { Attendance, IAttendance } from '../models/Attendance';
export declare class AttendanceService {
    private attendanceRepository;
    constructor();
    getAllAttendance(): Promise<Attendance[]>;
    getAttendanceById(id: number): Promise<Attendance | null>;
    getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]>;
    getAttendanceStats(employeeId: number): Promise<{
        present: number;
        absent: number;
        total: number;
    }>;
    createAttendance(data: Partial<IAttendance>): Promise<Attendance>;
    updateAttendance(id: number, data: Partial<IAttendance>): Promise<Attendance | null>;
    deleteAttendance(id: number): Promise<boolean>;
}
//# sourceMappingURL=AttendanceService.d.ts.map