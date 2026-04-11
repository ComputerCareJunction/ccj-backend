"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const BlogService_1 = require("../services/BlogService");
class BlogController {
    constructor() {
        this.getAllBlogs = async (req, res) => {
            try {
                const blogs = await this.blogService.getAllBlogs();
                res.json({ success: true, data: blogs });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch blogs' });
            }
        };
        this.getBlogById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const blog = await this.blogService.getBlogById(id);
                if (!blog) {
                    res.status(404).json({ error: 'Blog not found' });
                    return;
                }
                res.json({ success: true, data: blog });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to fetch blog' });
            }
        };
        this.createBlog = async (req, res) => {
            try {
                const blog = await this.blogService.createBlog(req.body);
                res.status(201).json({ success: true, data: blog });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to create blog' });
            }
        };
        this.updateBlog = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const blog = await this.blogService.updateBlog(id, req.body);
                if (!blog) {
                    res.status(404).json({ error: 'Blog not found' });
                    return;
                }
                res.json({ success: true, data: blog });
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to update blog' });
            }
        };
        this.deleteBlog = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const success = await this.blogService.deleteBlog(id);
                if (!success) {
                    res.status(404).json({ error: 'Blog not found' });
                    return;
                }
                res.json({ success: true, message: 'Blog deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error.message || 'Failed to delete blog' });
            }
        };
        this.blogService = new BlogService_1.BlogService();
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=BlogController.js.map