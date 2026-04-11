export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LATE = 'late',
    HALF_DAY = 'half-day',
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

export class Attendance implements IAttendance {
    public id?: number;
    public employee_id: number;
    public date: Date;
    public check_in?: string;
    public check_out?: string;
    public status: AttendanceStatus;
    public notes?: string;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IAttendance) {
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

