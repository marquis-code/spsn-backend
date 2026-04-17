import { ExcelService } from '../excel/excel.service';
import type { Response } from 'express';
import { FormsService } from './forms.service';
export declare class FormsController {
    private readonly formsService;
    private readonly excelService;
    constructor(formsService: FormsService, excelService: ExcelService);
    export(formId: string, res: Response): Promise<void>;
    create(createFormDto: any): Promise<import("./schemas/form.schema").DynamicFormDocument>;
    findAll(): Promise<import("./schemas/form.schema").DynamicFormDocument[]>;
    findOne(id: string): Promise<import("./schemas/form.schema").DynamicFormDocument>;
    submit(formId: string, submissionData: any): Promise<import("./schemas/form.schema").FormResponse>;
    getResponses(formId: string): Promise<import("./schemas/form.schema").FormResponse[]>;
}
