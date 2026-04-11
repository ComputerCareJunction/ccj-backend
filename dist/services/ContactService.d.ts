import { Contact, IContact } from '../models/Contact';
export declare class ContactService {
    private contactRepository;
    private emailService;
    constructor();
    createContact(data: Partial<IContact>): Promise<Contact>;
    getAllContacts(): Promise<Contact[]>;
    getContactById(id: number): Promise<Contact | null>;
    updateScreeningStatus(id: number, status: 'screening' | 'done' | null): Promise<Contact | null>;
}
//# sourceMappingURL=ContactService.d.ts.map