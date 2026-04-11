import { BaseRepository } from './BaseRepository';
import { Order, IOrder } from '../models/Order';
export declare class OrderRepository extends BaseRepository<Order> {
    constructor();
    findAll(): Promise<Order[]>;
    findById(id: number): Promise<Order | null>;
    findByOrderNumber(orderNumber: string): Promise<Order | null>;
    create(data: Partial<IOrder>): Promise<Order>;
    update(id: number, data: Partial<IOrder>): Promise<Order | null>;
    delete(id: number): Promise<boolean>;
    private mapRowToOrder;
}
//# sourceMappingURL=OrderRepository.d.ts.map