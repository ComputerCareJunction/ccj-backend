import { BaseRepository } from './BaseRepository';
import { Contact, IContact } from '../models/Contact';
export declare class ContactRepository extends BaseRepository<Contact> {
    constructor();
    findAll(): Promise<Contact[]>;
    findById(id: number): Promise<Contact | null>;
    create(data: Partial<IContact>): Promise<Contact>;
    update(id: number, data: Partial<IContact>): Promise<Contact | null>;
    delete(id: number): Promise<boolean>;
    private mapRowToContact;
}
//# sourceMappingURL=ContactRepository.d.ts.map