import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';

const router = Router();
const blogController = new BlogController();

/**
 * @swagger
 * /api/public/blogs:
 *   get:
 *     summary: Get all public blogs
 *     description: Retrieve all blog posts (public access - no authentication required)
 *     tags:
 *       - Public Blogs
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get('/', blogController.getAllBlogs);

/**
 * @swagger
 * /api/public/blogs/{id}:
 *   get:
 *     summary: Get public blog by ID
 *     description: Retrieve a specific blog post by ID (public access)
 *     tags:
 *       - Public Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', blogController.getBlogById);

export default router;

