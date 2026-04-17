import type { Response } from 'express';
import { AbstractsService } from './abstracts.service';
import { ExcelService } from '../excel/excel.service';
export declare class AbstractsController {
    private readonly abstractsService;
    private readonly excelService;
    constructor(abstractsService: AbstractsService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createAbstractDto: any): Promise<import("./schemas/abstract.schema").AbstractDocument>;
    findAll(conferenceId?: string): Promise<import("./schemas/abstract.schema").AbstractDocument[]>;
    update(id: string, updateAbstractDto: any): Promise<import("./schemas/abstract.schema").AbstractDocument>;
}
