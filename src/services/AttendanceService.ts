import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { Attendance, IAttendance } from '../models/Attendance';

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;

    constructor() {
        this.attendanceRepository = new AttendanceRepository();
    }

    async getAllAttendance(): Promise<Attendance[]> {
        return await this.attendanceRepository.findAll();
    }

    async getAttendanceById(id: number): Promise<Attendance | null> {
        return await this.attendanceRepository.findById(id);
    }

    async getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]> {
        return await this.attendanceRepository.findByEmployeeId(employeeId);
    }

    async getAttendanceStats(employeeId: number): Promise<{
        present: number;
        absent: number;
        total: number;
    }> {
        return await this.attendanceRepository.getAttendanceStats(employeeId);
    }

    async createAttendance(data: Partial<IAttendance>): Promise<Attendance> {
        return await this.attendanceRepository.create(data);
    }

    async updateAttendance(id: number, data: Partial<IAttendance>): Promise<Attendance | null> {
        return await this.attendanceRepository.update(id, data);
    }

    async deleteAttendance(id: number): Promise<boolean> {
        return await this.attendanceRepository.delete(id);
    }
}

