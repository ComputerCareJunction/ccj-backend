"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Products routes - No permission restrictions, all authenticated users (admin and sub_user) have full access
// Get all products
router.get('/', productController.getAllProducts);
// Get product by ID
router.get('/:id', productController.getProductById);
// Get product by slug
router.get('/slug/:slug', productController.getProductBySlug);
// Get products by brand
router.get('/brand/:brand', productController.getProductsByBrand);
// Get products by brand and category
router.get('/brand/:brand/category/:category', productController.getProductsByBrandAndCategory);
// Get products by category
router.get('/category/:category', productController.getProductsByCategory);
// Get unique brands
router.get('/brands/list', productController.getUniqueBrands);
// Get categories by brand
router.get('/brand/:brand/categories/list', productController.getCategoriesByBrand);
// Get shop dropdown data
router.get('/shop/dropdown', productController.getShopDropdownData);
// Create product
router.post('/', productController.createProduct);
// Update product
router.put('/:id', productController.updateProduct);
// Delete product
router.delete('/:id', productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map