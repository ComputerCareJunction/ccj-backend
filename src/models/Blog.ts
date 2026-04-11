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

export class Blog implements IBlog {
    public id?: number;
    public title: string;
    public content: string;
    public excerpt?: string;
    public description?: string;
    public author: string;
    public date: Date;
    public image?: string;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IBlog) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.excerpt = data.excerpt;
        this.description = data.description || data.excerpt;
        this.author = data.author;
        this.date = data.date;
        this.image = data.image;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

