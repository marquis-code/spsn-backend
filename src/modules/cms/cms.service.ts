import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SiteConfig, SiteConfigDocument } from './schemas/site-config.schema';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(SiteConfig.name) private siteConfigModel: Model<SiteConfigDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getConfig(): Promise<SiteConfigDocument> {
    // Check cache first
    const cached = await this.cacheManager.get<SiteConfigDocument>('site_config');
    if (cached) return cached;

    let config = await this.siteConfigModel.findOne({ configKey: 'main' }).lean().exec();
    if (!config) {
      // Create default config
      config = await this.siteConfigModel.create({ configKey: 'main' });
      config = config.toObject();
    }

    await this.cacheManager.set('site_config', config, 1800); // 30 min cache
    return config as any;
  }

  async updateConfig(updateDto: Partial<SiteConfig>): Promise<SiteConfigDocument> {
    // Remove configKey from updates to prevent override
    delete (updateDto as any).configKey;

    const updated = await this.siteConfigModel.findOneAndUpdate(
      { configKey: 'main' },
      { $set: updateDto },
      { new: true, upsert: true },
    ).lean().exec();

    // Invalidate cache
    await this.cacheManager.del('site_config');

    return updated as any;
  }

  async updateSection(section: string, data: any): Promise<SiteConfigDocument> {
    const updated = await this.siteConfigModel.findOneAndUpdate(
      { configKey: 'main' },
      { $set: { [section]: data } },
      { new: true, upsert: true },
    ).lean().exec();

    await this.cacheManager.del('site_config');
    return updated as any;
  }

  async getChatbotKnowledge(): Promise<string[]> {
    const config = await this.getConfig();
    return config.chatbotKnowledge || [];
  }
}
