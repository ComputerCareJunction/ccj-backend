import { Request, Response } from 'express';
import { ContactService } from '../services/ContactService';

export class ContactController {
    private contactService: ContactService;

    constructor() {
        this.contactService = new ContactService();
    }

    createContact = async (req: Request, res: Response): Promise<void> => {
        try {
            const contact = await this.contactService.createContact(req.body);
            res.status(201).json({
                success: true,
                message: 'Contact submitted successfully',
                data: contact,
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to submit contact form',
            });
        }
    };

    getAllContacts = async (req: Request, res: Response): Promise<void> => {
        try {
            const contacts = await this.contactService.getAllContacts();
            res.json({
                success: true,
                data: contacts,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch contacts',
            });
        }
    };

    getContactById = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch contact',
            });
        }
    };

    updateScreeningStatus = async (req: Request, res: Response): Promise<void> => {
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
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to update screening status',
            });
        }
    };
}

