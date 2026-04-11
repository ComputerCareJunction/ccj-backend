"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(data) {
        this.id = data.id;
        this.order_number = data.order_number;
        this.customer_name = data.customer_name;
        this.customer_email = data.customer_email;
        this.customer_phone = data.customer_phone;
        this.shipping_address = data.shipping_address;
        this.city = data.city;
        this.pincode = data.pincode;
        this.payment_method = data.payment_method || 'cash';
        this.status = data.status || 'pending';
        this.total_amount = data.total_amount;
        this.items = data.items || [];
        this.notes = data.notes || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map