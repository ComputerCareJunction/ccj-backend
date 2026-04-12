import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const contactController = new ContactController();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Create contact submission
 *     description: Submit a new contact form (public endpoint - no authentication required)
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *   get:
 *     summary: Get all contact submissions
 *     description: Retrieve all contact submissions (requires authentication)
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', contactController.createContact);

// Protected routes - require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: Get contact by ID
 *     description: Retrieve a specific contact submission
 *     tags:
 *       - Contact
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
 *         description: Contact retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update contact screening status
 *     description: Update the screening status of a contact
 *     tags:
 *       - Contact
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
 *             required:
 *               - screening_status
 *             properties:
 *               screening_status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.patch('/:id/screening-status', contactController.updateScreeningStatus);

export default router;

