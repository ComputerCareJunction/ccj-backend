export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export interface IEmployee {
    id?: number;
    employee_id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    hire_date: Date;
    status: EmployeeStatus;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Employee implements IEmployee {
    id?: number;
    employee_id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    hire_date: Date;
    status: EmployeeStatus;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IEmployee);
}
//# sourceMappingURL=Employee.d.ts.map