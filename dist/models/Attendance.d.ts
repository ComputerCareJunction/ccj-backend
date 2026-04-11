export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    HALF_DAY = "half-day"
}
export interface IAttendance {
    id?: number;
    employee_id: number;
    date: Date;
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Attendance implements IAttendance {
    id?: number;
    employee_id: number;
    date: Date;
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IAttendance);
}
//# sourceMappingURL=Attendance.d.ts.map