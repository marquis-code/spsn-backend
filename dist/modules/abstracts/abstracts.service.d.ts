import { Model } from 'mongoose';
import { AbstractDocument } from './schemas/abstract.schema';
export declare class AbstractsService {
    private abstractModel;
    constructor(abstractModel: Model<AbstractDocument>);
    create(createAbstractDto: any): Promise<AbstractDocument>;
    findAll(): Promise<AbstractDocument[]>;
    findByConference(conferenceId: string): Promise<AbstractDocument[]>;
    update(id: string, updateAbstractDto: any): Promise<AbstractDocument>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}
