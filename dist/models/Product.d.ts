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
export declare class Product implements IProduct {
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
    specifications?: Record<string, any> | null;
    features?: string | null;
    warranty?: string | null;
    sku?: string | null;
    dimensions?: string | null;
    weight?: string | null;
    color?: string | null;
    created_at?: Date;
    updated_at?: Date;
    constructor(data: IProduct);
}
//# sourceMappingURL=Product.d.ts.map