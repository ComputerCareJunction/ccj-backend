import { Request, Response } from 'express';
import { BlogService } from '../services/BlogService';
import { AuthenticatedRequest } from '../middleware/auth';

export class BlogController {
    private blogService: BlogService;

    constructor() {
        this.blogService = new BlogService();
    }

    getAllBlogs = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const blogs = await this.blogService.getAllBlogs();
            res.json({ success: true, data: blogs });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch blogs' });
        }
    };

    getBlogById = async (req: Request | AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const blog = await this.blogService.getBlogById(id);
            if (!blog) {
                res.status(404).json({ error: 'Blog not found' });
                return;
            }
            res.json({ success: true, data: blog });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to fetch blog' });
        }
    };

    createBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const blog = await this.blogService.createBlog(req.body);
            res.status(201).json({ success: true, data: blog });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create blog' });
        }
    };

    updateBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const blog = await this.blogService.updateBlog(id, req.body);
            if (!blog) {
                res.status(404).json({ error: 'Blog not found' });
                return;
            }
            res.json({ success: true, data: blog });
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update blog' });
        }
    };

    deleteBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.blogService.deleteBlog(id);
            if (!success) {
                res.status(404).json({ error: 'Blog not found' });
                return;
            }
            res.json({ success: true, message: 'Blog deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete blog' });
        }
    };
}

