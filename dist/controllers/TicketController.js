"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const TicketService_1 = require("../services/TicketService");
class TicketController {
    constructor() {
        this.createTicket = async (req, res) => {
            try {
                const ticket = await this.ticketService.createTicket(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Ticket created successfully',
                    data: ticket,
                });
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to create ticket',
                });
            }
        };
        this.getAllTickets = async (req, res) => {
            try {
                const tickets = await this.ticketService.getAllTickets();
                res.json({
                    success: true,
                    data: tickets,
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch tickets',
                });
            }
        };
        this.getTicketById = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to fetch ticket',
                });
            }
        };
        this.updateTicket = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    error: error.message || 'Failed to update ticket',
                });
            }
        };
        this.updateTicketStatus = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to update ticket status',
                });
            }
        };
        this.deleteTicket = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to delete ticket',
                });
            }
        };
        this.ticketService = new TicketService_1.TicketService();
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=TicketController.js.map