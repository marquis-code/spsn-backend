import { Model } from 'mongoose';
import { MemberDocument } from './schemas/member.schema';
export declare class MembersImportService {
    private memberModel;
    constructor(memberModel: Model<MemberDocument>);
    importFromExcel(file: Express.Multer.File): Promise<{
        total: number;
        imported: number;
        skipped: number;
        errors: string[];
    }>;
}
