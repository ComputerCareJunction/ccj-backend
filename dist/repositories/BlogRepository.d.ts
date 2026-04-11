import { BaseRepository } from './BaseRepository';
import { Blog, IBlog } from '../models/Blog';
export declare class BlogRepository extends BaseRepository<Blog> {
    constructor();
    findAll(): Promise<Blog[]>;
    findById(id: number): Promise<Blog | null>;
    create(data: Partial<IBlog>): Promise<Blog>;
    update(id: number, data: Partial<IBlog>): Promise<Blog | null>;
    delete(id: number): Promise<boolean>;
    private mapRowToBlog;
}
//# sourceMappingURL=BlogRepository.d.ts.map