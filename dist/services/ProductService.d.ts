import { Product, IProduct } from '../models/Product';
export declare class ProductService {
    private productRepository;
    constructor();
    getAllProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product | null>;
    getProductBySlug(slug: string): Promise<Product | null>;
    createProduct(data: Partial<IProduct>): Promise<Product>;
    updateProduct(id: number, data: Partial<IProduct>): Promise<Product | null>;
    deleteProduct(id: number): Promise<boolean>;
    getProductsByBrand(brand: string): Promise<Product[]>;
    getProductsByBrandAndCategory(brand: string, category: string): Promise<Product[]>;
    getProductsByCategory(category: string): Promise<Product[]>;
    getUniqueBrands(): Promise<string[]>;
    getCategoriesByBrand(brand: string): Promise<string[]>;
    getUniqueCategories(): Promise<string[]>;
    getShopDropdownData(): Promise<Array<{
        brand: string;
        subtitles: Array<{
            label: string;
            path: string;
        }>;
    }>>;
}
//# sourceMappingURL=ProductService.d.ts.map