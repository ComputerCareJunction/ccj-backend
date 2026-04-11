"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const ContactRepository_1 = require("../repositories/ContactRepository");
const EmailService_1 = require("./EmailService");
class ContactService {
    constructor() {
        this.contactRepository = new ContactRepository_1.ContactRepository();
        this.emailService = new EmailService_1.EmailService();
    }
    async createContact(data) {
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
        }
        catch (error) {
            console.error('Email sending failed, but contact was saved:', error);
            // Continue even if email fails - contact is still saved in DB
        }
        return contact;
    }
    async getAllContacts() {
        return await this.contactRepository.findAll();
    }
    async getContactById(id) {
        return await this.contactRepository.findById(id);
    }
    async updateScreeningStatus(id, status) {
        const contact = await this.contactRepository.findById(id);
        if (!contact) {
            throw new Error('Contact not found');
        }
        return await this.contactRepository.update(id, { screening_status: status });
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=ContactService.js.map