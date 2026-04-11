import { Request, Response } from 'express';
export declare class OrderController {
    private orderService;
    constructor();
    createOrder: (req: Request, res: Response) => Promise<void>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<void>;
    getOrderByOrderNumber: (req: Request, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response) => Promise<void>;
    updateOrder: (req: Request, res: Response) => Promise<void>;
    deleteOrder: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=OrderController.d.ts.map