"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Employee_1 = require("../models/Employee");
class EmployeeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('tbl_employees');
    }
    async findAll() {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToEmployee(row));
    }
    async findById(id) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }
    async findByEmployeeId(employeeId) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE employee_id = $1`, [employeeId]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }
    async findByEmail(email) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE LOWER(email) = LOWER($1)`, [email]);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }
    async generateEmployeeId() {
        // Get the maximum numeric part from existing employee IDs
        const result = await this.query(`SELECT employee_id FROM ${this.tableName} WHERE employee_id LIKE 'CCJ-%' ORDER BY employee_id DESC LIMIT 1`);
        if (result.rows.length > 0) {
            const lastEmployeeId = result.rows[0].employee_id;
            const numericPart = parseInt(lastEmployeeId.replace('CCJ-', ''));
            if (!isNaN(numericPart)) {
                // Generate next ID based on highest existing ID
                // Check if this ID already exists (in case of gaps or deletions)
                let counter = 0;
                while (counter < 100) { // Safety limit
                    const nextNum = numericPart + 1 + counter;
                    const newEmployeeId = `CCJ-${String(nextNum).padStart(2, '0')}`;
                    const exists = await this.findByEmployeeId(newEmployeeId);
                    if (!exists) {
                        return newEmployeeId;
                    }
                    counter++;
                }
                // Fallback: use timestamp if all sequential IDs are taken
                return `CCJ-${Date.now().toString().slice(-4)}`;
            }
        }
        // If no existing employees, start with CCJ-01
        return 'CCJ-01';
    }
    async create(data) {
        let employeeId = data.employee_id;
        if (!employeeId) {
            employeeId = await this.generateEmployeeId();
        }
        const result = await this.query(`INSERT INTO ${this.tableName} (employee_id, name, email, phone, position, department, hire_date, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`, [
            employeeId,
            data.name,
            data.email,
            data.phone || null,
            data.position || null,
            data.department || null,
            data.hire_date,
            data.status || Employee_1.EmployeeStatus.ACTIVE,
        ]);
        return this.mapRowToEmployee(result.rows[0]);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (data.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.email !== undefined) {
            updates.push(`email = $${paramCount++}`);
            values.push(data.email);
        }
        if (data.phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(data.phone);
        }
        if (data.position !== undefined) {
            updates.push(`position = $${paramCount++}`);
            values.push(data.position);
        }
        if (data.department !== undefined) {
            updates.push(`department = $${paramCount++}`);
            values.push(data.department);
        }
        if (data.hire_date !== undefined) {
            updates.push(`hire_date = $${paramCount++}`);
            values.push(data.hire_date);
        }
        if (data.status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(data.status);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const result = await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows.length > 0 ? this.mapRowToEmployee(result.rows[0]) : null;
    }
    async delete(id) {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }
    mapRowToEmployee(row) {
        return new Employee_1.Employee({
            id: row.id,
            employee_id: row.employee_id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            position: row.position,
            department: row.department,
            hire_date: new Date(row.hire_date),
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
exports.EmployeeRepository = EmployeeRepository;
//# sourceMappingURL=EmployeeRepository.js.map