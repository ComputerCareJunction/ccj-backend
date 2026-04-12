import { BaseRepository } from './BaseRepository';
import { Employee, IEmployee, EmployeeStatus } from '../models/Employee';

export class EmployeeRepository extends BaseRepository<Employee> {
    constructor() {
        super('tbl_employees');
    }

    async findAll(): Promise<Employee[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map((row) => this.mapRowToEmployee(row));
    }

    async findById(id: number): Promise<Employee | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }

    async findByEmployeeId(employeeId: string): Promise<Employee | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE employee_id = ?`, [
            employeeId,
        ]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<Employee | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE LOWER(email) = LOWER(?)`, [
            email,
        ]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }

    async generateEmployeeId(): Promise<string> {
        const result = await this.query(
            `SELECT employee_id FROM ${this.tableName} WHERE employee_id LIKE 'CCJ-%' ORDER BY employee_id DESC LIMIT 1`
        );

        if (result.rows.length > 0) {
            const lastEmployeeId = result.rows[0].employee_id;
            const numericPart = parseInt(lastEmployeeId.replace('CCJ-', ''), 10);
            if (!isNaN(numericPart)) {
                let counter = 0;
                while (counter < 100) {
                    const nextNum = numericPart + 1 + counter;
                    const newEmployeeId = `CCJ-${String(nextNum).padStart(2, '0')}`;
                    const exists = await this.findByEmployeeId(newEmployeeId);
                    if (!exists) {
                        return newEmployeeId;
                    }
                    counter++;
                }
                return `CCJ-${Date.now().toString().slice(-4)}`;
            }
        }

        return 'CCJ-01';
    }

    async create(data: Partial<IEmployee>): Promise<Employee> {
        let employeeId = data.employee_id;
        if (!employeeId) {
            employeeId = await this.generateEmployeeId();
        }

        const ins = await this.query(
            `INSERT INTO ${this.tableName} (employee_id, name, email, phone, position, department, hire_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employeeId,
                data.name!,
                data.email!,
                data.phone || null,
                data.position || null,
                data.department || null,
                data.hire_date!,
                data.status || EmployeeStatus.ACTIVE,
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create employee');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToEmployee(fetched.rows[0]);
    }

    async update(id: number, data: Partial<IEmployee>): Promise<Employee | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push(`name = ?`);
            values.push(data.name);
        }
        if (data.email !== undefined) {
            updates.push(`email = ?`);
            values.push(data.email);
        }
        if (data.phone !== undefined) {
            updates.push(`phone = ?`);
            values.push(data.phone);
        }
        if (data.position !== undefined) {
            updates.push(`position = ?`);
            values.push(data.position);
        }
        if (data.department !== undefined) {
            updates.push(`department = ?`);
            values.push(data.department);
        }
        if (data.hire_date !== undefined) {
            updates.push(`hire_date = ?`);
            values.push(data.hire_date);
        }
        if (data.status !== undefined) {
            updates.push(`status = ?`);
            values.push(data.status);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    private mapRowToEmployee(row: any): Employee {
        return new Employee({
            id: row.id,
            employee_id: row.employee_id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            position: row.position,
            department: row.department,
            hire_date: new Date(row.hire_date),
            status: row.status as EmployeeStatus,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
