import { Request, Response } from 'express';
export declare class ContactController {
    private contactService;
    constructor();
    createContact: (req: Request, res: Response) => Promise<void>;
    getAllContacts: (req: Request, res: Response) => Promise<void>;
    getContactById: (req: Request, res: Response) => Promise<void>;
    updateScreeningStatus: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ContactController.d.ts.map