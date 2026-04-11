"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BlogController_1 = require("../controllers/BlogController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const blogController = new BlogController_1.BlogController();
// All routes require authentication
router.use(auth_1.authMiddleware.authenticate);
// Blogs routes - No permission restrictions, all authenticated users (admin and sub_user) have full access
// Get all blogs
router.get('/', blogController.getAllBlogs);
// Get blog by ID
router.get('/:id', blogController.getBlogById);
// Create blog
router.post('/', blogController.createBlog);
// Update blog
router.put('/:id', blogController.updateBlog);
// Delete blog
router.delete('/:id', blogController.deleteBlog);
exports.default = router;
//# sourceMappingURL=blogs.routes.js.map