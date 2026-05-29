import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('broadcast')
  async broadcast(@Body() payload: { type: string; data: any }) {
    return this.campaignsService.broadcastCampaign(payload.type, payload.data);
  }
}
