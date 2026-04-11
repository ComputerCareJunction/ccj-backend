export interface IProduct {
    id?: number;
    name: string;
    slug: string;
    brand?: string;
    category?: string;
    image: string;
    price: number;
    original_price?: string | null;
    discount?: string | null;
    description: string;
    in_stock?: boolean;
    specifications?: string | Record<string, any> | null;
    features?: string | null;
    warranty?: string | null;
    sku?: string | null;
    dimensions?: string | null;
    weight?: string | null;
    color?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export class Product implements IProduct {
    public id?: number;
    public name: string;
    public slug: string;
    public brand?: string;
    public category?: string;
    public image: string;
    public price: number;
    public original_price?: string | null;
    public discount?: string | null;
    public description: string;
    public in_stock?: boolean;
    public specifications?: Record<string, any> | null;
    public features?: string | null;
    public warranty?: string | null;
    public sku?: string | null;
    public dimensions?: string | null;
    public weight?: string | null;
    public color?: string | null;
    public created_at?: Date;
    public updated_at?: Date;

    constructor(data: IProduct) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.brand = data.brand;
        this.category = data.category;
        this.image = data.image;
        this.price = data.price;
        this.original_price = data.original_price || null;
        this.discount = data.discount || null;
        this.description = data.description;
        this.in_stock = data.in_stock !== undefined ? data.in_stock : true;
        // Handle specifications - convert string to object if needed, or keep as object
        if (typeof data.specifications === 'string') {
            try {
                this.specifications = JSON.parse(data.specifications);
            } catch {
                // If parsing fails, treat as empty object or null
                this.specifications = data.specifications.trim() ? { raw: data.specifications } : null;
            }
        } else {
            this.specifications = data.specifications || null;
        }
        this.features = data.features || null;
        this.warranty = data.warranty || null;
        this.sku = data.sku || null;
        this.dimensions = data.dimensions || null;
        this.weight = data.weight || null;
        this.color = data.color || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

