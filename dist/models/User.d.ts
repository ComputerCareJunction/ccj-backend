export declare enum UserRole {
    ADMIN = "admin",
    SUB_USER = "sub_user",
    CUSTOMER = "customer"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
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
export declare class User implements IUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IUser);
    toPublicJSON(): Omit<IUser, 'password'>;
}
//# sourceMappingURL=User.d.ts.map