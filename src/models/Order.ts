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

export class Order implements IOrder {
    public id?: number;
    public order_number?: string;
    public customer_name: string;
    public customer_email: string;
    public customer_phone: string;
    public shipping_address: string;
    public city: string;
    public pincode: string;
    public payment_method: string;
    public status: string;
    public total_amount: number;
    public items: IOrderItem[];
    public notes?: string | null;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IOrder) {
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

