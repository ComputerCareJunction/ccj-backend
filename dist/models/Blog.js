"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.excerpt = data.excerpt;
        this.description = data.description || data.excerpt;
        this.author = data.author;
        this.date = data.date;
        this.image = data.image;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Blog = Blog;
//# sourceMappingURL=Blog.js.map