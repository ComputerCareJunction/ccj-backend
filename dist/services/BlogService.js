"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const BlogRepository_1 = require("../repositories/BlogRepository");
class BlogService {
    constructor() {
        this.blogRepository = new BlogRepository_1.BlogRepository();
    }
    async getAllBlogs() {
        return await this.blogRepository.findAll();
    }
    async getBlogById(id) {
        return await this.blogRepository.findById(id);
    }
    async createBlog(data) {
        return await this.blogRepository.create(data);
    }
    async updateBlog(id, data) {
        return await this.blogRepository.update(id, data);
    }
    async deleteBlog(id) {
        return await this.blogRepository.delete(id);
    }
}
exports.BlogService = BlogService;
//# sourceMappingURL=BlogService.js.map