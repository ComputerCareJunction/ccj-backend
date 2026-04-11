import { BaseRepository } from './BaseRepository';
import { Employee, IEmployee } from '../models/Employee';
export declare class EmployeeRepository extends BaseRepository<Employee> {
    constructor();
    findAll(): Promise<Employee[]>;
    findById(id: number): Promise<Employee | null>;
    findByEmployeeId(employeeId: string): Promise<Employee | null>;
    findByEmail(email: string): Promise<Employee | null>;
    generateEmployeeId(): Promise<string>;
    create(data: Partial<IEmployee>): Promise<Employee>;
    update(id: number, data: Partial<IEmployee>): Promise<Employee | null>;
    delete(id: number): Promise<boolean>;
    private mapRowToEmployee;
}
//# sourceMappingURL=EmployeeRepository.d.ts.map