export interface IOrderItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
}
export interface IOrder {
    id?: number;
    order_number?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    pincode: string;
    payment_method: string;
    status?: string;
    total_amount: number;
    items: IOrderItem[];
    notes?: string | null;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Order implements IOrder {
    id?: number;
    order_number?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    pincode: string;
    payment_method: string;
    status: string;
    total_amount: number;
    items: IOrderItem[];
    notes?: string | null;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IOrder);
}
//# sourceMappingURL=Order.d.ts.map