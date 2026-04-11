export enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
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

export class Employee implements IEmployee {
    public id?: number;
    public employee_id: string;
    public name: string;
    public email: string;
    public phone?: string;
    public position: string;
    public department: string;
    public hire_date: Date;
    public status: EmployeeStatus;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IEmployee) {
        this.id = data.id;
        this.employee_id = data.employee_id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.position = data.position;
        this.department = data.department;
        this.hire_date = data.hire_date;
        this.status = data.status;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

