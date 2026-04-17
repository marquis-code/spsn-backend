import type { Response } from 'express';
import { EnquiriesService } from './enquiries.service';
import { ExcelService } from '../excel/excel.service';
export declare class EnquiriesController {
    private readonly enquiriesService;
    private readonly excelService;
    constructor(enquiriesService: EnquiriesService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createEnquiryDto: any): Promise<import("./schemas/enquiry.schema").EnquiryDocument>;
    findAll(): Promise<import("./schemas/enquiry.schema").EnquiryDocument[]>;
    findOne(id: string): Promise<import("./schemas/enquiry.schema").EnquiryDocument>;
    update(id: string, updateEnquiryDto: any): Promise<import("./schemas/enquiry.schema").EnquiryDocument>;
    remove(id: string): Promise<any>;
}
