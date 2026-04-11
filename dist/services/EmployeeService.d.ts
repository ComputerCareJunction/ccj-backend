import { Employee, IEmployee } from '../models/Employee';
export declare class EmployeeService {
    private employeeRepository;
    constructor();
    getAllEmployees(): Promise<Employee[]>;
    getEmployeeById(id: number): Promise<Employee | null>;
    getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null>;
    getEmployeeByEmail(email: string): Promise<Employee | null>;
    createEmployee(data: Partial<IEmployee>): Promise<Employee>;
    updateEmployee(id: number, data: Partial<IEmployee>): Promise<Employee | null>;
    deleteEmployee(id: number): Promise<boolean>;
    syncUsersToEmployees(): Promise<{
        created: number;
        updated: number;
        errors: string[];
    }>;
}
//# sourceMappingURL=EmployeeService.d.ts.map