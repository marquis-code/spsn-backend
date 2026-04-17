import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  getConfig() {
    return this.cmsService.getConfig();
  }

  @Patch()
  updateConfig(@Body() updateDto: any) {
    return this.cmsService.updateConfig(updateDto);
  }

  @Patch('section/:section')
  updateSection(@Param('section') section: string, @Body() data: any) {
    return this.cmsService.updateSection(section, data);
  }
}
