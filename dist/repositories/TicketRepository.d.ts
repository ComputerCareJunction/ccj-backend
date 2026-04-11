import { BaseRepository } from './BaseRepository';
import { Ticket, ITicket } from '../models/Ticket';
export declare class TicketRepository extends BaseRepository<Ticket> {
    constructor();
    findAll(): Promise<Ticket[]>;
    findById(id: number): Promise<Ticket | null>;
    create(data: Partial<ITicket>): Promise<Ticket>;
    update(id: number, data: Partial<ITicket>): Promise<Ticket | null>;
    updateStatus(id: number, status: 'todo' | 'in_progress' | 'done' | 'closed'): Promise<Ticket | null>;
    delete(id: number): Promise<boolean>;
    private mapRowToTicket;
}
//# sourceMappingURL=TicketRepository.d.ts.map