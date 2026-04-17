import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { ConferenceDocument } from './schemas/conference.schema';
export declare class ConferencesService {
    private conferenceModel;
    private cacheManager;
    constructor(conferenceModel: Model<ConferenceDocument>, cacheManager: Cache);
    create(createConferenceDto: any): Promise<ConferenceDocument>;
    findAll(): Promise<ConferenceDocument[]>;
    findOne(id: string): Promise<ConferenceDocument>;
    update(id: string, updateConferenceDto: any): Promise<ConferenceDocument>;
    delete(id: string): Promise<any>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}
