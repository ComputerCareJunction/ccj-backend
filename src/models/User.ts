export enum UserRole {
    ADMIN = 'admin',
    SUB_USER = 'sub_user',
    CUSTOMER = 'customer',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    created_at?: Date;
    updated_at?: Date;
}

export class User implements IUser {
    public id?: number;
    public name: string;
    public email: string;
    public password?: string;
    public phone: string;
    public role: UserRole;
    public status: UserStatus;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IUser) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.role = data.role;
        this.status = data.status;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    public toPublicJSON(): Omit<IUser, 'password'> {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            role: this.role,
            status: this.status,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}

