import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MembersService } from '../members/members.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DuesCronService {
  private readonly logger = new Logger(DuesCronService.name);

  constructor(
    private readonly membersService: MembersService,
    private readonly mailService: MailService,
  ) {}

  // Run on January 1st every year at 09:00 AM
  @Cron('0 9 1 1 *')
  async handleAnnualDuesReminder() {
    this.logger.log('Executing annual dues reminder cron job...');
    try {
      const members = await this.membersService.findAll();
      
      let sentCount = 0;
      for (const member of members) {
        if (member.email && member.isActive) {
          const name = member.fullName || 'Member';
          await this.mailService.sendAnnualDuesReminder(member.email, name);
          sentCount++;
        }
      }
      
      this.logger.log(`Annual dues reminder completed. Sent to ${sentCount} members.`);
    } catch (error) {
      this.logger.error('Failed to execute annual dues reminder cron job', error);
    }
  }
}
