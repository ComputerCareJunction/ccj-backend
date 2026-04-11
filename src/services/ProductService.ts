import { ProductRepository } from '../repositories/ProductRepository';
import { Product, IProduct } from '../models/Product';

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.findAll();
    }

    async getProductById(id: number): Promise<Product | null> {
        return await this.productRepository.findById(id);
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        return await this.productRepository.findBySlug(slug);
    }

    async createProduct(data: Partial<IProduct>): Promise<Product> {
        return await this.productRepository.create(data);
    }

    async updateProduct(id: number, data: Partial<IProduct>): Promise<Product | null> {
        return await this.productRepository.update(id, data);
    }

    async deleteProduct(id: number): Promise<boolean> {
        return await this.productRepository.delete(id);
    }

    async getProductsByBrand(brand: string): Promise<Product[]> {
        return await this.productRepository.findByBrand(brand);
    }

    async getProductsByBrandAndCategory(brand: string, category: string): Promise<Product[]> {
        return await this.productRepository.findByBrandAndCategory(brand, category);
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        return await this.productRepository.findByCategory(category);
    }

    async getUniqueBrands(): Promise<string[]> {
        return await this.productRepository.getUniqueBrands();
    }

    async getCategoriesByBrand(brand: string): Promise<string[]> {
        return await this.productRepository.getCategoriesByBrand(brand);
    }

    async getUniqueCategories(): Promise<string[]> {
        return await this.productRepository.getUniqueCategories();
    }

    async getShopDropdownData(): Promise<Array<{ brand: string; subtitles: Array<{ label: string; path: string }> }>> {
        const brands = await this.productRepository.getUniqueBrands();
        const dropdownData: Array<{ brand: string; subtitles: Array<{ label: string; path: string }> }> = [];

        for (const brand of brands) {
            const categories = await this.productRepository.getCategoriesByBrand(brand);
            // Remove duplicates by normalizing category names
            const uniqueCategories = Array.from(new Set(categories.map(cat => cat.toLowerCase().trim())))
                .map(cat => {
                    // Find original category name (preserve case from first occurrence)
                    return categories.find(orig => orig.toLowerCase().trim() === cat) || cat;
                });

            if (uniqueCategories.length > 0) {
                const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                dropdownData.push({
                    brand: brand,
                    subtitles: uniqueCategories.map(category => {
                        const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        // Capitalize first letter of each word
                        const label = category.split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ');
                        return {
                            label: label,
                            path: `/products/${brandSlug}/${categorySlug}`
                        };
                    })
                });
            }
        }

        return dropdownData;
    }
}

