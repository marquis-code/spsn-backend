import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SiteConfig, SiteConfigDocument } from './schemas/site-config.schema';
import { TranslationService } from './translation.service';

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(
    @InjectModel(SiteConfig.name) private siteConfigModel: Model<SiteConfigDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private translationService: TranslationService,
  ) {}

  async getConfig(lang: string = 'en'): Promise<SiteConfigDocument> {
    const configKey = lang === 'en' ? 'main' : `main_${lang}`;
    const cacheKey = `site_config_${lang}`;

    // Check cache first
    const cached = await this.cacheManager.get<SiteConfigDocument>(cacheKey);
    if (cached) return cached;

    let config = await this.siteConfigModel.findOne({ configKey }).lean().exec();
    if (!config && lang !== 'en') {
      // Fallback to English if translation is missing
      config = await this.siteConfigModel.findOne({ configKey: 'main' }).lean().exec();
    }
    
    if (!config) {
      // Create default config
      config = await this.siteConfigModel.create({ configKey: 'main' });
      config = config.toObject();
    }

    await this.cacheManager.set(cacheKey, config, 1800); // 30 min cache
    return config as any;
  }

  private async triggerTranslations(baseConfig: any) {
    const targetLangs = ['fr', 'es', 'pt'];
    
    // Copy the object without mongoose specifics
    const configToTranslate = JSON.parse(JSON.stringify(baseConfig));
    delete configToTranslate._id;
    delete configToTranslate.__v;
    delete configToTranslate.createdAt;
    delete configToTranslate.updatedAt;

    for (const lang of targetLangs) {
      try {
        const translatedConfig = await this.translationService.translateObject(configToTranslate, lang);
        translatedConfig.configKey = `main_${lang}`;
        
        await this.siteConfigModel.findOneAndUpdate(
          { configKey: `main_${lang}` },
          { $set: translatedConfig },
          { new: true, upsert: true }
        ).exec();
        
        // Invalidate language cache
        await this.cacheManager.del(`site_config_${lang}`);
      } catch (error) {
        this.logger.error(`Failed to translate config to ${lang}`, error);
      }
    }
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
    await this.cacheManager.del('site_config_en');

    // Trigger async translations
    this.triggerTranslations(updated);

    return updated as any;
  }

  async updateSection(section: string, data: any): Promise<SiteConfigDocument> {
    const updated = await this.siteConfigModel.findOneAndUpdate(
      { configKey: 'main' },
      { $set: { [section]: data } },
      { new: true, upsert: true },
    ).lean().exec();

    await this.cacheManager.del('site_config_en');
    
    // Trigger async translations
    this.triggerTranslations(updated);

    return updated as any;
  }

  async getChatbotKnowledge(): Promise<string[]> {
    const config = await this.getConfig();
    return config.chatbotKnowledge || [];
  }
}
