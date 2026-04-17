import type { Response } from 'express';
import { BlogsService } from './blogs.service';
import { ExcelService } from '../excel/excel.service';
export declare class BlogsController {
    private readonly blogsService;
    private readonly excelService;
    constructor(blogsService: BlogsService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createBlogDto: any): Promise<import("./schemas/blog.schema").BlogDocument>;
    findAll(status?: string): Promise<import("./schemas/blog.schema").BlogDocument[]>;
    findOne(id: string): Promise<import("./schemas/blog.schema").BlogDocument>;
    findBySlug(slug: string): Promise<import("./schemas/blog.schema").BlogDocument>;
    update(id: string, updateBlogDto: any): Promise<import("./schemas/blog.schema").BlogDocument>;
    remove(id: string): Promise<any>;
}
