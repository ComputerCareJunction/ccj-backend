"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const OrderRepository_1 = require("../repositories/OrderRepository");
const EmailService_1 = require("./EmailService");
class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository_1.OrderRepository();
        this.emailService = new EmailService_1.EmailService();
    }
    async createOrder(data) {
        // Validate required fields
        if (!data.customer_name || !data.customer_email || !data.customer_phone) {
            throw new Error('Customer name, email, and phone are required');
        }
        if (!data.shipping_address || !data.city || !data.pincode) {
            throw new Error('Shipping address, city, and pincode are required');
        }
        if (!data.items || data.items.length === 0) {
            throw new Error('Order must contain at least one item');
        }
        if (!data.total_amount || data.total_amount <= 0) {
            throw new Error('Total amount must be greater than 0');
        }
        // Calculate total from items if not provided
        if (!data.total_amount) {
            data.total_amount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        // Create order in database
        const order = await this.orderRepository.create(data);
        // Send email notification (don't fail if email fails)
        try {
            await this.emailService.sendOrderConfirmationEmail({
                orderNumber: order.order_number || '',
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                items: order.items,
                totalAmount: order.total_amount,
                shippingAddress: `${order.shipping_address}, ${order.city}, ${order.pincode}`,
                paymentMethod: order.payment_method,
            });
        }
        catch (error) {
            console.error('Email sending failed, but order was saved:', error);
            // Continue even if email fails - order is still saved in DB
        }
        return order;
    }
    async getAllOrders() {
        return await this.orderRepository.findAll();
    }
    async getOrderById(id) {
        return await this.orderRepository.findById(id);
    }
    async getOrderByOrderNumber(orderNumber) {
        return await this.orderRepository.findByOrderNumber(orderNumber);
    }
    async updateOrderStatus(id, status) {
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return await this.orderRepository.update(id, { status });
    }
    async updateOrder(id, data) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return await this.orderRepository.update(id, data);
    }
    async deleteOrder(id) {
        return await this.orderRepository.delete(id);
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map