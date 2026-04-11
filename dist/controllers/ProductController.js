"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    constructor() {
        this.getAllProducts = async (req, res) => {
            try {
                const products = await this.productService.getAllProducts();
                res.json({ success: true, data: products });
            }
            catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch products'
                });
            }
        };
        this.getProductById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const product = await this.productService.getProductById(id);
                if (!product) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                res.json({ success: true, data: product });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch product' });
            }
        };
        this.createProduct = async (req, res) => {
            try {
                const product = await this.productService.createProduct(req.body);
                res.status(201).json({ success: true, data: product });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to create product' });
            }
        };
        this.updateProduct = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const product = await this.productService.updateProduct(id, req.body);
                if (!product) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                res.json({ success: true, data: product });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to update product' });
            }
        };
        this.deleteProduct = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const success = await this.productService.deleteProduct(id);
                if (!success) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                res.json({ success: true, message: 'Product deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to delete product' });
            }
        };
        this.getProductBySlug = async (req, res) => {
            try {
                const slug = req.params.slug;
                const product = await this.productService.getProductBySlug(slug);
                if (!product) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                res.json({ success: true, data: product });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch product' });
            }
        };
        this.getProductsByBrand = async (req, res) => {
            try {
                const brand = req.params.brand;
                const products = await this.productService.getProductsByBrand(brand);
                res.json({ success: true, data: products });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch products' });
            }
        };
        this.getProductsByBrandAndCategory = async (req, res) => {
            try {
                const brand = req.params.brand;
                const category = req.params.category;
                const products = await this.productService.getProductsByBrandAndCategory(brand, category);
                res.json({ success: true, data: products });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch products' });
            }
        };
        this.getProductsByCategory = async (req, res) => {
            try {
                const category = req.params.category;
                const products = await this.productService.getProductsByCategory(category);
                res.json({ success: true, data: products });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch products' });
            }
        };
        this.getUniqueBrands = async (req, res) => {
            try {
                const brands = await this.productService.getUniqueBrands();
                res.json({ success: true, data: brands });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch brands' });
            }
        };
        this.getCategoriesByBrand = async (req, res) => {
            try {
                const brand = req.params.brand;
                const categories = await this.productService.getCategoriesByBrand(brand);
                res.json({ success: true, data: categories });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch categories' });
            }
        };
        this.getShopDropdownData = async (req, res) => {
            try {
                const dropdownData = await this.productService.getShopDropdownData();
                res.json({ success: true, data: dropdownData });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch shop dropdown data' });
            }
        };
        this.productService = new ProductService_1.ProductService();
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map