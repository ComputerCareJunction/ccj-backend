export interface IContact {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    looking_for?: string;
    location?: string;
    message: string;
    form_type?: 'contact' | 'consultation';
    screening_status?: 'screening' | 'done' | null;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Contact implements IContact {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    looking_for?: string;
    location?: string;
    message: string;
    form_type?: 'contact' | 'consultation';
    screening_status?: 'screening' | 'done' | null;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IContact);
}
//# sourceMappingURL=Contact.d.ts.map