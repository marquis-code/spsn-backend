import { CmsService } from './cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getConfig(): Promise<import("./schemas/site-config.schema").SiteConfigDocument>;
    updateConfig(updateDto: any): Promise<import("./schemas/site-config.schema").SiteConfigDocument>;
    updateSection(section: string, data: any): Promise<import("./schemas/site-config.schema").SiteConfigDocument>;
}
