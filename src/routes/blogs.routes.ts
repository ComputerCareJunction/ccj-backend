import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';
import { authMiddleware } from '../middleware/auth';
import { permissionMiddleware } from '../middleware/permissions';
import { DashboardSection, PermissionAction } from '../models/DashboardPermission';

const router = Router();
const blogController = new BlogController();

// All routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve all blog posts (authenticated users)
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/', blogController.getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     description: Retrieve a specific blog post by ID
 *     tags:
 *       - Blogs
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
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *   put:
 *     summary: Update blog post
 *     description: Update an existing blog post
 *     tags:
 *       - Blogs
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *   delete:
 *     summary: Delete blog post
 *     description: Delete a blog post
 *     tags:
 *       - Blogs
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
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
router.post('/', blogController.createBlog);

router.get('/:id', blogController.getBlogById);

router.put('/:id', blogController.updateBlog);

router.delete('/:id', blogController.deleteBlog);

export default router;

