"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const UploadController_1 = require("../controllers/UploadController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const uploadController = new UploadController_1.UploadController();
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Upload image route
router.post('/image', upload.single('image'), uploadController.uploadImage);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map