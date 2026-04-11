export declare class EmailService {
    private transporter;
    constructor();
    sendContactEmail(data: {
        name: string;
        email: string;
        phone?: string;
        subject?: string;
        looking_for?: string;
        location?: string;
        message: string;
        form_type?: string;
    }): Promise<void>;
    sendOrderConfirmationEmail(data: {
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        items: Array<{
            name: string;
            price: number;
            quantity: number;
        }>;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
    }): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map