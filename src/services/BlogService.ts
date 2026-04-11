import { BlogRepository } from '../repositories/BlogRepository';
import { Blog, IBlog } from '../models/Blog';

export class BlogService {
    private blogRepository: BlogRepository;

    constructor() {
        this.blogRepository = new BlogRepository();
    }

    async getAllBlogs(): Promise<Blog[]> {
        return await this.blogRepository.findAll();
    }

    async getBlogById(id: number): Promise<Blog | null> {
        return await this.blogRepository.findById(id);
    }

    async createBlog(data: Partial<IBlog>): Promise<Blog> {
        return await this.blogRepository.create(data);
    }

    async updateBlog(id: number, data: Partial<IBlog>): Promise<Blog | null> {
        return await this.blogRepository.update(id, data);
    }

    async deleteBlog(id: number): Promise<boolean> {
        return await this.blogRepository.delete(id);
    }
}

