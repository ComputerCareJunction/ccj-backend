import { Request, Response } from 'express';
export declare class TicketController {
    private ticketService;
    constructor();
    createTicket: (req: Request, res: Response) => Promise<void>;
    getAllTickets: (req: Request, res: Response) => Promise<void>;
    getTicketById: (req: Request, res: Response) => Promise<void>;
    updateTicket: (req: Request, res: Response) => Promise<void>;
    updateTicketStatus: (req: Request, res: Response) => Promise<void>;
    deleteTicket: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=TicketController.d.ts.map