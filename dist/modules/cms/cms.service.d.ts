import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { SiteConfig, SiteConfigDocument } from './schemas/site-config.schema';
export declare class CmsService {
    private siteConfigModel;
    private cacheManager;
    constructor(siteConfigModel: Model<SiteConfigDocument>, cacheManager: Cache);
    getConfig(): Promise<SiteConfigDocument>;
    updateConfig(updateDto: Partial<SiteConfig>): Promise<SiteConfigDocument>;
    updateSection(section: string, data: any): Promise<SiteConfigDocument>;
    getChatbotKnowledge(): Promise<string[]>;
}
