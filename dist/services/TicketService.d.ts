import { Ticket, ITicket } from '../models/Ticket';
export declare class TicketService {
    private ticketRepository;
    constructor();
    createTicket(data: Partial<ITicket>): Promise<Ticket>;
    getAllTickets(): Promise<Ticket[]>;
    getTicketById(id: number): Promise<Ticket | null>;
    updateTicket(id: number, data: Partial<ITicket>): Promise<Ticket | null>;
    updateTicketStatus(id: number, status: 'todo' | 'in_progress' | 'done' | 'closed'): Promise<Ticket | null>;
    deleteTicket(id: number): Promise<boolean>;
}
//# sourceMappingURL=TicketService.d.ts.map