"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
// Public routes - no authentication required
router.get('/', productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/brand/:brand', productController.getProductsByBrand);
router.get('/brand/:brand/category/:category', productController.getProductsByBrandAndCategory);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/brands', productController.getUniqueBrands);
router.get('/brand/:brand/categories', productController.getCategoriesByBrand);
router.get('/shop/dropdown', productController.getShopDropdownData);
exports.default = router;
//# sourceMappingURL=products-public.routes.js.map