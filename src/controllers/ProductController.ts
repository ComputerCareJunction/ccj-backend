import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { AuthenticatedRequest } from '../middleware/auth';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    getAllProducts = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts();
            res.json({ success: true, data: products });
        } catch (error: any) {
            console.error('Error fetching products:', error);
            res.status(500).json({ 
                success: false,
                error: error.message || 'Failed to fetch products' 
            });
        }
    };

    getProductById = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json({ success: true, data: product });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch product' });
        }
    };

    createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create product' });
        }
    };

    updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.updateProduct(id, req.body);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json({ success: true, data: product });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update product' });
        }
    };

    deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.productService.deleteProduct(id);
            if (!success) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json({ success: true, message: 'Product deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete product' });
        }
    };

    getProductBySlug = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const slug = req.params.slug;
            const product = await this.productService.getProductBySlug(slug);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json({ success: true, data: product });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch product' });
        }
    };

    getProductsByBrand = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const brand = req.params.brand;
            const products = await this.productService.getProductsByBrand(brand);
            res.json({ success: true, data: products });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch products' });
        }
    };

    getProductsByBrandAndCategory = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const brand = req.params.brand;
            const category = req.params.category;
            const products = await this.productService.getProductsByBrandAndCategory(brand, category);
            res.json({ success: true, data: products });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch products' });
        }
    };

    getProductsByCategory = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const category = req.params.category;
            const products = await this.productService.getProductsByCategory(category);
            res.json({ success: true, data: products });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch products' });
        }
    };

    getUniqueBrands = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const brands = await this.productService.getUniqueBrands();
            res.json({ success: true, data: brands });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch brands' });
        }
    };

    getCategoriesByBrand = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const brand = req.params.brand;
            const categories = await this.productService.getCategoriesByBrand(brand);
            res.json({ success: true, data: categories });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch categories' });
        }
    };

    getShopDropdownData = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const dropdownData = await this.productService.getShopDropdownData();
            res.json({ success: true, data: dropdownData });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch shop dropdown data' });
        }
    };
}

