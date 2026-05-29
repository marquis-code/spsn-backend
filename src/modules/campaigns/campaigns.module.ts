import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { MailModule } from '../mail/mail.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MailModule, MembersModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
