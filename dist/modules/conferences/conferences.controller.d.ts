import type { Response } from 'express';
import { ConferencesService } from './conferences.service';
import { ExcelService } from '../excel/excel.service';
export declare class ConferencesController {
    private readonly conferencesService;
    private readonly excelService;
    constructor(conferencesService: ConferencesService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createConferenceDto: any): Promise<import("./schemas/conference.schema").ConferenceDocument>;
    findAll(): Promise<import("./schemas/conference.schema").ConferenceDocument[]>;
    findOne(id: string): Promise<import("./schemas/conference.schema").ConferenceDocument>;
    update(id: string, updateConferenceDto: any): Promise<import("./schemas/conference.schema").ConferenceDocument>;
    remove(id: string): Promise<any>;
}
