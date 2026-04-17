import { Model } from 'mongoose';
import { EnquiryDocument } from './schemas/enquiry.schema';
export declare class EnquiriesService {
    private enquiryModel;
    constructor(enquiryModel: Model<EnquiryDocument>);
    create(createEnquiryDto: any): Promise<EnquiryDocument>;
    findAll(): Promise<EnquiryDocument[]>;
    findOne(id: string): Promise<EnquiryDocument>;
    update(id: string, updateEnquiryDto: any): Promise<EnquiryDocument>;
    delete(id: string): Promise<any>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}
