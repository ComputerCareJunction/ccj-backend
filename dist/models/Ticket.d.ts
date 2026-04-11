export interface ITicket {
    id?: number;
    ticket_name: string;
    ticket_type: string;
    requested_by: string;
    phone_number: string;
    message: string;
    status?: 'todo' | 'in_progress' | 'done' | 'closed';
    priority?: 'low' | 'medium' | 'high';
    created_at?: Date;
    updated_at?: Date;
}
export declare class Ticket implements ITicket {
    id?: number;
    ticket_name: string;
    ticket_type: string;
    requested_by: string;
    phone_number: string;
    message: string;
    status?: 'todo' | 'in_progress' | 'done' | 'closed';
    priority?: 'low' | 'medium' | 'high';
    created_at?: Date;
    updated_at?: Date;
    constructor(data: ITicket);
}
//# sourceMappingURL=Ticket.d.ts.map