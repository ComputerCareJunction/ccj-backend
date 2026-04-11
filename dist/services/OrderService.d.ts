import { Order, IOrder } from '../models/Order';
export declare class OrderService {
    private orderRepository;
    private emailService;
    constructor();
    createOrder(data: Partial<IOrder>): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: number): Promise<Order | null>;
    getOrderByOrderNumber(orderNumber: string): Promise<Order | null>;
    updateOrderStatus(id: number, status: string): Promise<Order | null>;
    updateOrder(id: number, data: Partial<IOrder>): Promise<Order | null>;
    deleteOrder(id: number): Promise<boolean>;
}
//# sourceMappingURL=OrderService.d.ts.map