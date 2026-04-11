export interface IBlog {
    id?: number;
    title: string;
    content: string;
    excerpt?: string;
    description?: string;
    author: string;
    date: Date;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Blog implements IBlog {
    id?: number;
    title: string;
    content: string;
    excerpt?: string;
    description?: string;
    author: string;
    date: Date;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IBlog);
}
//# sourceMappingURL=Blog.d.ts.map