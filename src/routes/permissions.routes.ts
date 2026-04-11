import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const permissionController = new PermissionController();

// All routes require authentication and admin role
router.use(authMiddleware.authenticate);
router.use(authMiddleware.requireAdmin);

/**
 * @swagger
 * /api/permissions/{userId}:
 *   get:
 *     summary: Get user permissions
 *     description: Retrieve all permissions for a specific user (admin only)
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *       404:
 *         description: User not found
 *   post:
 *     summary: Set permission for user
 *     description: Set a specific permission for a user
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section
 *               - actions
 *             properties:
 *               section:
 *                 type: string
 *                 description: Dashboard section
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Permission actions
 *     responses:
 *       200:
 *         description: Permission set successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete all permissions for user
 *     description: Remove all permissions from a user
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permissions deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/:userId', permissionController.getUserPermissions);

/**
 * @swagger
 * /api/permissions/{userId}/all:
 *   post:
 *     summary: Set all permissions for user
 *     description: Grant all permissions to a user
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All permissions granted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post('/:userId', permissionController.setPermission);

router.post('/:userId/all', permissionController.setAllPermissions);

router.delete('/:userId', permissionController.deleteUserPermissions);

export default router;

