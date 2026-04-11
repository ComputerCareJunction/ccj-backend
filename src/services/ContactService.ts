import { ContactRepository } from '../repositories/ContactRepository';
import { Contact, IContact } from '../models/Contact';
import { EmailService } from './EmailService';

export class ContactService {
    private contactRepository: ContactRepository;
    private emailService: EmailService;

    constructor() {
        this.contactRepository = new ContactRepository();
        this.emailService = new EmailService();
    }

    async createContact(data: Partial<IContact>): Promise<Contact> {
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            throw new Error('Name, email, and message are required');
        }

        // Create contact in database
        const contact = await this.contactRepository.create(data);

        // Send email notification (don't fail if email fails)
        try {
            await this.emailService.sendContactEmail({
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                subject: contact.subject,
                looking_for: contact.looking_for,
                location: contact.location,
                message: contact.message,
                form_type: contact.form_type,
            });
        } catch (error: any) {
            console.error('Email sending failed, but contact was saved:', error);
            // Continue even if email fails - contact is still saved in DB
        }

        return contact;
    }

    async getAllContacts(): Promise<Contact[]> {
        return await this.contactRepository.findAll();
    }

    async getContactById(id: number): Promise<Contact | null> {
        return await this.contactRepository.findById(id);
    }

    async updateScreeningStatus(id: number, status: 'screening' | 'done' | null): Promise<Contact | null> {
        const contact = await this.contactRepository.findById(id);
        if (!contact) {
            throw new Error('Contact not found');
        }

        return await this.contactRepository.update(id, { screening_status: status });
    }
}

