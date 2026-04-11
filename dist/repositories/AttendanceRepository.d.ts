import { BaseRepository } from './BaseRepository';
import { Attendance, IAttendance } from '../models/Attendance';
export declare class AttendanceRepository extends BaseRepository<Attendance> {
    constructor();
    findAll(): Promise<Attendance[]>;
    findById(id: number): Promise<Attendance | null>;
    findByEmployeeId(employeeId: number): Promise<Attendance[]>;
    findByEmployeeAndDate(employeeId: number, date: Date): Promise<Attendance | null>;
    create(data: Partial<IAttendance>): Promise<Attendance>;
    update(id: number, data: Partial<IAttendance>): Promise<Attendance | null>;
    delete(id: number): Promise<boolean>;
    getAttendanceStats(employeeId: number): Promise<{
        present: number;
        absent: number;
        total: number;
    }>;
    private mapRowToAttendance;
}
//# sourceMappingURL=AttendanceRepository.d.ts.map