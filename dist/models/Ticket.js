"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
class Ticket {
    constructor(data) {
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
exports.Ticket = Ticket;
//# sourceMappingURL=Ticket.js.map