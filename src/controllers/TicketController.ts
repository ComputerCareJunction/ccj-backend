import { Request, Response } from 'express';
import { TicketService } from '../services/TicketService';

export class TicketController {
    private ticketService: TicketService;

    constructor() {
        this.ticketService = new TicketService();
    }

    createTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const ticket = await this.ticketService.createTicket(req.body);
            res.status(201).json({
                success: true,
                message: 'Ticket created successfully',
                data: ticket,
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to create ticket',
            });
        }
    };

    getAllTickets = async (req: Request, res: Response): Promise<void> => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            res.json({
                success: true,
                data: tickets,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch tickets',
            });
        }
    };

    getTicketById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid ticket ID' });
                return;
            }

            const ticket = await this.ticketService.getTicketById(id);
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }
            res.json({
                success: true,
                data: ticket,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to fetch ticket',
            });
        }
    };

    updateTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid ticket ID' });
                return;
            }

            const ticket = await this.ticketService.updateTicket(id, req.body);
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }

            res.json({
                success: true,
                message: 'Ticket updated successfully',
                data: ticket,
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || 'Failed to update ticket',
            });
        }
    };

    updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid ticket ID' });
                return;
            }

            const { status } = req.body;
            if (!status) {
                res.status(400).json({ error: 'Status is required' });
                return;
            }

            if (!['todo', 'in_progress', 'done', 'closed'].includes(status)) {
                res.status(400).json({ 
                    error: 'Invalid status. Must be one of: todo, in_progress, done, closed' 
                });
                return;
            }

            const ticket = await this.ticketService.updateTicketStatus(id, status);
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }

            res.json({
                success: true,
                message: 'Ticket status updated successfully',
                data: ticket,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to update ticket status',
            });
        }
    };

    deleteTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid ticket ID' });
                return;
            }

            const deleted = await this.ticketService.deleteTicket(id);
            if (!deleted) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }

            res.json({
                success: true,
                message: 'Ticket deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || 'Failed to delete ticket',
            });
        }
    };
}

