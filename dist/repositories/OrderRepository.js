"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Order_1 = require("../models/Order");
class OrderRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('tbl_orders');
    }
    async findAll() {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToOrder(row));
    }
    async findById(id) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToOrder(result.rows[0]);
    }
    async findByOrderNumber(orderNumber) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE order_number = $1`, [orderNumber]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToOrder(result.rows[0]);
    }
    async create(data) {
        // Generate order number
        const orderNumberResult = await this.query('SELECT generate_order_number() AS order_number');
        const orderNumber = orderNumberResult.rows[0].order_number;
        const result = await this.query(`INSERT INTO ${this.tableName} 
            (order_number, customer_name, customer_email, customer_phone, shipping_address, city, pincode, payment_method, status, total_amount, items, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`, [
            orderNumber,
            data.customer_name,
            data.customer_email,
            data.customer_phone,
            data.shipping_address,
            data.city,
            data.pincode,
            data.payment_method || 'cash',
            data.status || 'pending',
            data.total_amount,
            JSON.stringify(data.items || []),
            data.notes || null,
        ]);
        return this.mapRowToOrder(result.rows[0]);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (data.status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            values.push(data.status);
        }
        if (data.notes !== undefined) {
            updates.push(`notes = $${paramIndex++}`);
            values.push(data.notes);
        }
        if (updates.length === 0) {
            return await this.findById(id);
        }
        values.push(id);
        const result = await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToOrder(result.rows[0]);
    }
    async delete(id) {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    mapRowToOrder(row) {
        // Safely parse items JSON
        let items = [];
        if (row.items) {
            if (typeof row.items === 'string') {
                try {
                    items = JSON.parse(row.items);
                }
                catch (error) {
                    // If JSON parsing fails, treat as empty array
                    console.warn(`Failed to parse items JSON for order ${row.id}:`, error);
                    items = [];
                }
            }
            else {
                items = row.items;
            }
        }
        return new Order_1.Order({
            id: row.id,
            order_number: row.order_number,
            customer_name: row.customer_name,
            customer_email: row.customer_email,
            customer_phone: row.customer_phone,
            shipping_address: row.shipping_address,
            city: row.city,
            pincode: row.pincode,
            payment_method: row.payment_method,
            status: row.status,
            total_amount: parseFloat(row.total_amount),
            items: items,
            notes: row.notes,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map