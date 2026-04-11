import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class BlogController {
    private blogService;
    constructor();
    getAllBlogs: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getBlogById: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    createBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=BlogController.d.ts.map