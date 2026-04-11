"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const TicketRepository_1 = require("../repositories/TicketRepository");
class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository_1.TicketRepository();
    }
    async createTicket(data) {
        // Validate required fields
        if (!data.ticket_name || !data.ticket_type || !data.requested_by || !data.phone_number || !data.message) {
            throw new Error('Ticket name, type, requested by, phone number, and message are required');
        }
        // Validate phone number format (10 digits)
        if (!/^\d{10}$/.test(data.phone_number)) {
            throw new Error('Phone number must be exactly 10 digits');
        }
        // Validate status if provided
        if (data.status && !['todo', 'in_progress', 'done', 'closed'].includes(data.status)) {
            throw new Error('Invalid status. Must be one of: todo, in_progress, done, closed');
        }
        // Validate priority if provided
        if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
            throw new Error('Invalid priority. Must be one of: low, medium, high');
        }
        // Set default priority to 'high' if not provided
        if (!data.priority) {
            data.priority = 'high';
        }
        return await this.ticketRepository.create(data);
    }
    async getAllTickets() {
        return await this.ticketRepository.findAll();
    }
    async getTicketById(id) {
        return await this.ticketRepository.findById(id);
    }
    async updateTicket(id, data) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        // Validate phone number format if provided
        if (data.phone_number && !/^\d{10}$/.test(data.phone_number)) {
            throw new Error('Phone number must be exactly 10 digits');
        }
        // Validate status if provided
        if (data.status && !['todo', 'in_progress', 'done', 'closed'].includes(data.status)) {
            throw new Error('Invalid status. Must be one of: todo, in_progress, done, closed');
        }
        // Validate priority if provided
        if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
            throw new Error('Invalid priority. Must be one of: low, medium, high');
        }
        return await this.ticketRepository.update(id, data);
    }
    async updateTicketStatus(id, status) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        if (!['todo', 'in_progress', 'done', 'closed'].includes(status)) {
            throw new Error('Invalid status. Must be one of: todo, in_progress, done, closed');
        }
        return await this.ticketRepository.updateStatus(id, status);
    }
    async deleteTicket(id) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        return await this.ticketRepository.delete(id);
    }
}
exports.TicketService = TicketService;
//# sourceMappingURL=TicketService.js.map