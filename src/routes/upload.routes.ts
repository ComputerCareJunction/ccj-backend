import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const uploadController = new UploadController();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// All routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image
 *     description: Upload an image to Cloudinary
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 5MB, must be image format)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary image URL
 *       400:
 *         description: Invalid file format or size exceeded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload failed
 */
router.post('/image', upload.single('image'), uploadController.uploadImage);

export default router;

