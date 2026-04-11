"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
class OrderController {
    constructor() {
        this.createOrder = async (req, res) => {
            try {
                const order = await this.orderService.createOrder(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Order placed successfully',
                    data: order,
                });
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to create order',
                });
            }
        };
        this.getAllOrders = async (req, res) => {
            try {
                const orders = await this.orderService.getAllOrders();
                res.json({
                    success: true,
                    data: orders,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch orders',
                });
            }
        };
        this.getOrderById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const order = await this.orderService.getOrderById(id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json({
                    success: true,
                    data: order,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch order',
                });
            }
        };
        this.getOrderByOrderNumber = async (req, res) => {
            try {
                const orderNumber = req.params.orderNumber;
                const order = await this.orderService.getOrderByOrderNumber(orderNumber);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json({
                    success: true,
                    data: order,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch order',
                });
            }
        };
        this.updateOrderStatus = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const { status } = req.body;
                if (!status) {
                    res.status(400).json({ error: 'Status is required' });
                    return;
                }
                const order = await this.orderService.updateOrderStatus(id, status);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Order status updated successfully',
                    data: order,
                });
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to update order status',
                });
            }
        };
        this.updateOrder = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const order = await this.orderService.updateOrder(id, req.body);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Order updated successfully',
                    data: order,
                });
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to update order',
                });
            }
        };
        this.deleteOrder = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const deleted = await this.orderService.deleteOrder(id);
                if (!deleted) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Order deleted successfully',
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to delete order',
                });
            }
        };
        this.orderService = new OrderService_1.OrderService();
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map