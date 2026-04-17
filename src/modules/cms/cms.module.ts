import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { SiteConfig, SiteConfigSchema } from './schemas/site-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SiteConfig.name, schema: SiteConfigSchema }]),
  ],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
