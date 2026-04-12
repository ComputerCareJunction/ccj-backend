import { BaseRepository } from './BaseRepository';
import { Order, IOrder } from '../models/Order';

function generateOrderNumber(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 1_000_000)
        .toString()
        .padStart(6, '0');
    return `ORD-${y}${m}${day}-${rand}`;
}

export class OrderRepository extends BaseRepository<Order> {
    constructor() {
        super('tbl_orders');
    }

    async findAll(): Promise<Order[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map((row) => this.mapRowToOrder(row));
    }

    async findById(id: number): Promise<Order | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        if (result.rows.length === 0) return null;
        return this.mapRowToOrder(result.rows[0]);
    }

    async findByOrderNumber(orderNumber: string): Promise<Order | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE order_number = ?`, [
            orderNumber,
        ]);
        if (result.rows.length === 0) return null;
        return this.mapRowToOrder(result.rows[0]);
    }

    async create(data: Partial<IOrder>): Promise<Order> {
        const orderNumber = generateOrderNumber();

        const ins = await this.query(
            `INSERT INTO ${this.tableName} 
            (order_number, customer_name, customer_email, customer_phone, shipping_address, city, pincode, payment_method, status, total_amount, items, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create order');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToOrder(fetched.rows[0]);
    }

    async update(id: number, data: Partial<IOrder>): Promise<Order | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.status !== undefined) {
            updates.push(`status = ?`);
            values.push(data.status);
        }
        if (data.notes !== undefined) {
            updates.push(`notes = ?`);
            values.push(data.notes);
        }

        if (updates.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`, values);

        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    private mapRowToOrder(row: any): Order {
        let items = [];
        if (row.items) {
            if (typeof row.items === 'string') {
                try {
                    items = JSON.parse(row.items);
                } catch (error) {
                    console.warn(`Failed to parse items JSON for order ${row.id}:`, error);
                    items = [];
                }
            } else {
                items = row.items;
            }
        }

        return new Order({
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
