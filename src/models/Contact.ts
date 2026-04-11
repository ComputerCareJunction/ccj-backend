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

export class Contact implements IContact {
    public id?: number;
    public name: string;
    public email: string;
    public phone?: string;
    public subject?: string;
    public looking_for?: string;
    public location?: string;
    public message: string;
    public form_type?: 'contact' | 'consultation';
    public screening_status?: 'screening' | 'done' | null;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IContact) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.subject = data.subject;
        this.looking_for = data.looking_for;
        this.location = data.location;
        this.message = data.message;
        this.form_type = data.form_type || 'contact';
        this.screening_status = data.screening_status || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

