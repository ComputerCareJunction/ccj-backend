"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const ContactService_1 = require("../services/ContactService");
class ContactController {
    constructor() {
        this.createContact = async (req, res) => {
            try {
                const contact = await this.contactService.createContact(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Contact submitted successfully',
                    data: contact,
                });
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to submit contact form',
                });
            }
        };
        this.getAllContacts = async (req, res) => {
            try {
                const contacts = await this.contactService.getAllContacts();
                res.json({
                    success: true,
                    data: contacts,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch contacts',
                });
            }
        };
        this.getContactById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const contact = await this.contactService.getContactById(id);
                if (!contact) {
                    res.status(404).json({ error: 'Contact not found' });
                    return;
                }
                res.json({
                    success: true,
                    data: contact,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch contact',
                });
            }
        };
        this.updateScreeningStatus = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const { screening_status } = req.body;
                if (!['screening', 'done', null].includes(screening_status)) {
                    res.status(400).json({ error: 'Invalid screening status. Must be "screening", "done", or null' });
                    return;
                }
                const contact = await this.contactService.updateScreeningStatus(id, screening_status);
                if (!contact) {
                    res.status(404).json({ error: 'Contact not found' });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Screening status updated successfully',
                    data: contact,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to update screening status',
                });
            }
        };
        this.contactService = new ContactService_1.ContactService();
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=ContactController.js.map