"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BlogController_1 = require("../controllers/BlogController");
const router = (0, express_1.Router)();
const blogController = new BlogController_1.BlogController();
// Public route - no authentication required
router.get('/', blogController.getAllBlogs);
// Public route - get blog by ID
router.get('/:id', blogController.getBlogById);
exports.default = router;
//# sourceMappingURL=blogs-public.routes.js.map