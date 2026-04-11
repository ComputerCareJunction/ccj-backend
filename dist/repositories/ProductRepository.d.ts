import { BaseRepository } from './BaseRepository';
import { Product, IProduct } from '../models/Product';
export declare class ProductRepository extends BaseRepository<Product> {
    constructor();
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    create(data: Partial<IProduct & {
        specifications?: string | Record<string, any> | null;
    }>): Promise<Product>;
    update(id: number, data: Partial<IProduct & {
        specifications?: string | Record<string, any> | null;
    }>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
    findByBrand(brand: string): Promise<Product[]>;
    findByBrandAndCategory(brand: string, category: string): Promise<Product[]>;
    findByCategory(category: string): Promise<Product[]>;
    getUniqueBrands(): Promise<string[]>;
    getCategoriesByBrand(brand: string): Promise<string[]>;
    getUniqueCategories(): Promise<string[]>;
    private mapRowToProduct;
}
//# sourceMappingURL=ProductRepository.d.ts.map