import { Blog, IBlog } from '../models/Blog';
export declare class BlogService {
    private blogRepository;
    constructor();
    getAllBlogs(): Promise<Blog[]>;
    getBlogById(id: number): Promise<Blog | null>;
    createBlog(data: Partial<IBlog>): Promise<Blog>;
    updateBlog(id: number, data: Partial<IBlog>): Promise<Blog | null>;
    deleteBlog(id: number): Promise<boolean>;
}
//# sourceMappingURL=BlogService.d.ts.map