"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class UploadController {
    constructor() {
        this.uploadImage = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ error: 'No file uploaded' });
                    return;
                }
                // Convert buffer to base64 for Cloudinary
                const base64Image = req.file.buffer.toString('base64');
                const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
                // Upload to Cloudinary
                const result = await cloudinary_1.default.uploader.upload(dataURI, {
                    resource_type: 'image',
                    folder: 'ccj/blogs', // Organize images in a folder
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' }, // Resize for blog images
                        { quality: 'auto' }, // Optimize quality
                    ],
                });
                res.json({
                    success: true,
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
            catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({ error: error.message || 'Failed to upload image' });
            }
        };
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=UploadController.js.map