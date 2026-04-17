import type { Response } from 'express';
import { MembersService } from './members.service';
import { MembersImportService } from './members-import.service';
import { ExcelService } from '../excel/excel.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class MembersController {
    private readonly membersService;
    private readonly membersImportService;
    private readonly cloudinaryService;
    private readonly excelService;
    constructor(membersService: MembersService, membersImportService: MembersImportService, cloudinaryService: CloudinaryService, excelService: ExcelService);
    export(res: Response): Promise<void>;
    getTemplate(res: Response): Promise<void>;
    register(payload: any): Promise<import("./schemas/member.schema").MemberDocument>;
    create(createMemberDto: any): Promise<import("./schemas/member.schema").MemberDocument>;
    findAll(): Promise<import("./schemas/member.schema").MemberDocument[]>;
    getMe(req: any): any;
    updateProfile(req: any, payload: any): Promise<import("./schemas/member.schema").MemberDocument>;
    findOne(id: string): Promise<import("./schemas/member.schema").MemberDocument>;
    update(id: string, updateMemberDto: any): Promise<import("./schemas/member.schema").MemberDocument>;
    remove(id: string): Promise<any>;
    importMembers(file: Express.Multer.File): Promise<{
        total: number;
        imported: number;
        skipped: number;
        errors: string[];
    }>;
}
