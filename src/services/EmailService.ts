import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configure Gmail SMTP transporter
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASSWORD || '', // Use App Password for Gmail
            },
        });
    }

    async sendContactEmail(data: {
        name: string;
        email: string;
        phone?: string;
        subject?: string;
        looking_for?: string;
        location?: string;
        message: string;
        form_type?: string;
    }): Promise<void> {
        const recipientEmail = process.env.CONTACT_EMAIL || 'moinansari310@gmail.com';
        
        const emailSubject = data.form_type === 'consultation' 
            ? 'Free Consultation Request' 
            : (data.subject || 'Contact Form Submission');

        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                    New ${data.form_type === 'consultation' ? 'Consultation' : 'Contact'} Form Submission
                </h2>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong style="color: #1e293b;">Name:</strong> <span style="color: #475569;">${data.name}</span></p>
                    <p><strong style="color: #1e293b;">Email:</strong> <span style="color: #475569;">${data.email}</span></p>
                    ${data.phone ? `<p><strong style="color: #1e293b;">Phone:</strong> <span style="color: #475569;">${data.phone}</span></p>` : ''}
                    ${data.subject ? `<p><strong style="color: #1e293b;">Subject:</strong> <span style="color: #475569;">${data.subject}</span></p>` : ''}
                    ${data.looking_for ? `<p><strong style="color: #1e293b;">Looking For:</strong> <span style="color: #475569;">${data.looking_for}</span></p>` : ''}
                    ${data.location ? `<p><strong style="color: #1e293b;">Location:</strong> <span style="color: #475569;">${data.location}</span></p>` : ''}
                </div>
                
                <div style="background: #ffffff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                    <p><strong style="color: #1e293b;">Message:</strong></p>
                    <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${data.message.replace(/\n/g, '<br>')}</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                    Submitted at: ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Computer Care Junction'}" <${process.env.EMAIL_USER || 'noreply@computercarejunction.in'}>`,
            to: recipientEmail,
            subject: emailSubject,
            html: emailBody,
            replyTo: data.email,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${recipientEmail}`);
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    async sendOrderConfirmationEmail(data: {
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        items: Array<{ name: string; price: number; quantity: number }>;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
    }): Promise<void> {
        const recipientEmail = data.customerEmail;
        
        const itemsList = data.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                    Order Confirmation - ${data.orderNumber}
                </h2>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong style="color: #1e293b;">Dear ${data.customerName},</strong></p>
                    <p style="color: #475569;">Thank you for your order! We've received your order and it's being processed.</p>
                </div>
                
                <div style="background: #ffffff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                    <h3 style="color: #1e293b; margin-top: 0;">Order Details</h3>
                    <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                    <p><strong>Shipping Address:</strong> ${data.shippingAddress}</p>
                    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #1e293b;">Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0;">Item</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
                                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsList}
                        </tbody>
                        <tfoot>
                            <tr style="background: #f9fafb; font-weight: bold;">
                                <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #e2e8f0;">Total Amount:</td>
                                <td style="padding: 15px; text-align: right; border-top: 2px solid #e2e8f0;">₹${data.totalAmount.toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #1e40af; margin: 0;"><strong>What's Next?</strong></p>
                    <p style="color: #475569; margin: 10px 0 0 0;">We'll process your order and send you updates via email. If you have any questions, please contact us.</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                    Thank you for choosing Computer Care Junction!<br>
                    Order placed at: ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Computer Care Junction'}" <${process.env.EMAIL_USER || 'noreply@computercarejunction.in'}>`,
            to: recipientEmail,
            subject: `Order Confirmation - ${data.orderNumber}`,
            html: emailBody,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent successfully to ${recipientEmail}`);
        } catch (error: any) {
            console.error('Error sending order confirmation email:', error);
            throw new Error('Failed to send order confirmation email');
        }
    }
}

