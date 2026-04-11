"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const ProductRepository_1 = require("../repositories/ProductRepository");
class ProductService {
    constructor() {
        this.productRepository = new ProductRepository_1.ProductRepository();
    }
    async getAllProducts() {
        return await this.productRepository.findAll();
    }
    async getProductById(id) {
        return await this.productRepository.findById(id);
    }
    async getProductBySlug(slug) {
        return await this.productRepository.findBySlug(slug);
    }
    async createProduct(data) {
        return await this.productRepository.create(data);
    }
    async updateProduct(id, data) {
        return await this.productRepository.update(id, data);
    }
    async deleteProduct(id) {
        return await this.productRepository.delete(id);
    }
    async getProductsByBrand(brand) {
        return await this.productRepository.findByBrand(brand);
    }
    async getProductsByBrandAndCategory(brand, category) {
        return await this.productRepository.findByBrandAndCategory(brand, category);
    }
    async getProductsByCategory(category) {
        return await this.productRepository.findByCategory(category);
    }
    async getUniqueBrands() {
        return await this.productRepository.getUniqueBrands();
    }
    async getCategoriesByBrand(brand) {
        return await this.productRepository.getCategoriesByBrand(brand);
    }
    async getUniqueCategories() {
        return await this.productRepository.getUniqueCategories();
    }
    async getShopDropdownData() {
        const brands = await this.productRepository.getUniqueBrands();
        const dropdownData = [];
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
                        const label = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map