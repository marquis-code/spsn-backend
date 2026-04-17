import { Model } from 'mongoose';
import { BlogDocument } from './schemas/blog.schema';
export declare class BlogsService {
    private blogModel;
    constructor(blogModel: Model<BlogDocument>);
    create(createBlogDto: any): Promise<BlogDocument>;
    findAll(status?: string): Promise<BlogDocument[]>;
    findOne(id: string): Promise<BlogDocument>;
    findBySlug(slug: string): Promise<BlogDocument>;
    update(id: string, updateBlogDto: any): Promise<BlogDocument>;
    delete(id: string): Promise<any>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}
