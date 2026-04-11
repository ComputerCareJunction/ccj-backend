import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * /api/public/products:
 *   get:
 *     summary: Get all public products
 *     description: Retrieve all products (public access - no authentication required)
 *     tags:
 *       - Public Products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/public/products/slug/{slug}:
 *   get:
 *     summary: Get public product by slug
 *     description: Retrieve a product by its slug (public access)
 *     tags:
 *       - Public Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/slug/:slug', productController.getProductBySlug);

/**
 * @swagger
 * /api/public/products/brand/{brand}:
 *   get:
 *     summary: Get public products by brand
 *     description: Retrieve all products from a specific brand (public access)
 *     tags:
 *       - Public Products
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/brand/:brand', productController.getProductsByBrand);

/**
 * @swagger
 * /api/public/products/brand/{brand}/category/{category}:
 *   get:
 *     summary: Get public products by brand and category
 *     description: Retrieve products by brand and category (public access)
 *     tags:
 *       - Public Products
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/brand/:brand/category/:category', productController.getProductsByBrandAndCategory);

/**
 * @swagger
 * /api/public/products/category/{category}:
 *   get:
 *     summary: Get public products by category
 *     description: Retrieve all products from a specific category (public access)
 *     tags:
 *       - Public Products
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @swagger
 * /api/public/products/brands:
 *   get:
 *     summary: Get unique brands
 *     description: Retrieve list of all unique brands (public access)
 *     tags:
 *       - Public Products
 *     responses:
 *       200:
 *         description: Brands list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/brands', productController.getUniqueBrands);

/**
 * @swagger
 * /api/public/products/brand/{brand}/categories:
 *   get:
 *     summary: Get public categories by brand
 *     description: Retrieve all categories for a specific brand (public access)
 *     tags:
 *       - Public Products
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/brand/:brand/categories', productController.getCategoriesByBrand);

/**
 * @swagger
 * /api/public/products/shop/dropdown:
 *   get:
 *     summary: Get shop dropdown data
 *     description: Get dropdown data for shop filter (public access)
 *     tags:
 *       - Public Products
 *     responses:
 *       200:
 *         description: Shop dropdown data retrieved successfully
 */
router.get('/shop/dropdown', productController.getShopDropdownData);

export default router;

