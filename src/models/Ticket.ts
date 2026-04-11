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

export class Ticket implements ITicket {
    public id?: number;
    public ticket_name: string;
    public ticket_type: string;
    public requested_by: string;
    public phone_number: string;
    public message: string;
    public status?: 'todo' | 'in_progress' | 'done' | 'closed';
    public priority?: 'low' | 'medium' | 'high';
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: ITicket) {
        this.id = data.id;
        this.ticket_name = data.ticket_name;
        this.ticket_type = data.ticket_type;
        this.requested_by = data.requested_by;
        this.phone_number = data.phone_number;
        this.message = data.message;
        this.status = data.status || 'todo';
        this.priority = data.priority || 'high';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

