import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middleware/auth';
import { permissionMiddleware } from '../middleware/permissions';
import { DashboardSection, PermissionAction } from '../models/DashboardPermission';

const router = Router();
const productController = new ProductController();

// All routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the system
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               original_price:
 *                 type: number
 *               discount_percentage:
 *                 type: number
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               brand_category:
 *                 type: string
 *               image:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update product
 *     description: Update product information
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               original_price:
 *                 type: number
 *               discount_percentage:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete product
 *     description: Delete a product from the system
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     description: Retrieve a product by its slug
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/slug/:slug', productController.getProductBySlug);

/**
 * @swagger
 * /api/products/brand/{brand}:
 *   get:
 *     summary: Get products by brand
 *     description: Retrieve all products from a specific brand
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/brand/:brand', productController.getProductsByBrand);

/**
 * @swagger
 * /api/products/brand/{brand}/category/{category}:
 *   get:
 *     summary: Get products by brand and category
 *     description: Retrieve products by brand and category
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/brand/:brand/category/:category', productController.getProductsByBrandAndCategory);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     description: Retrieve all products from a specific category
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/brands/list:
 *   get:
 *     summary: Get unique brands
 *     description: Retrieve list of all unique brands
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Brands list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/brands/list', productController.getUniqueBrands);

/**
 * @swagger
 * /api/products/brand/{brand}/categories/list:
 *   get:
 *     summary: Get categories by brand
 *     description: Retrieve all categories for a specific brand
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/brand/:brand/categories/list', productController.getCategoriesByBrand);

/**
 * @swagger
 * /api/products/shop/dropdown:
 *   get:
 *     summary: Get shop dropdown data
 *     description: Get dropdown data for shop filter
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop dropdown data retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/shop/dropdown', productController.getShopDropdownData);

router.post('/', productController.createProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

export default router;

