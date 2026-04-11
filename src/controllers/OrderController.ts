import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    createOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const order = await this.orderService.createOrder(req.body);
            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: order,
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to create order',
            });
        }
    };

    getAllOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json({
                success: true,
                data: orders,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch orders',
            });
        }
    };

    getOrderById = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch order',
            });
        }
    };

    getOrderByOrderNumber = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch order',
            });
        }
    };

    updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to update order status',
            });
        }
    };

    updateOrder = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to update order',
            });
        }
    };

    deleteOrder = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to delete order',
            });
        }
    };
}

