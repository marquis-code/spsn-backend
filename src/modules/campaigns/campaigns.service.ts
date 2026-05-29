import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { MembersService } from '../members/members.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly mailService: MailService,
    private readonly membersService: MembersService,
  ) {}

  async broadcastCampaign(type: string, data: any) {
    let subject = 'SCPSN Notification';
    let html = '';

    switch (type) {
      case 'new_month':
        subject = `Happy New Month from SCPSN - ${data.month}`;
        html = this.buildNewMonthHtml(data);
        break;
      case 'spotlight':
        subject = `Member Spotlight: ${data.name}`;
        html = this.buildSpotlightHtml(data);
        break;
      case 'webinar':
        subject = `SCPSN Monthly Webinar: ${data.theme}`;
        html = this.buildWebinarHtml(data);
        break;
      default:
        throw new Error('Invalid campaign type');
    }

    const members = await this.membersService.findAll();
    // Filter out inactive members or those without emails
    const validEmails = members.filter(m => m.email && m.isActive !== false).map(m => m.email);

    // Send in chunks of 50 to avoid rate limits
    const chunkSize = 50;
    let sentCount = 0;
    
    for (let i = 0; i < validEmails.length; i += chunkSize) {
      const chunk = validEmails.slice(i, i + chunkSize);
      
      // We will send to a single "bcc" or "to" array if MailService supports it.
      // But currently mailService.sendMail takes a single string. 
      // Resend allows multiple emails in 'to' up to 50.
      await this.mailService.sendMail(chunk.join(','), subject, html);
      sentCount += chunk.length;
    }

    return { success: true, message: `Campaign broadcasted to ${sentCount} members.` };
  }

  private buildNewMonthHtml(data: any): string {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: ${data.bgColor || '#5e1b5b'}; border-radius: 16px; overflow: hidden;">
        <div style="background: #eef2f6; padding: 40px; text-align: center; border-bottom-left-radius: 40px; position: relative;">
           <h1 style="color: #0f172a; font-size: 28px; margin: 0;">Happy New Month from SCPSN</h1>
        </div>
        <div style="padding: 40px; color: white;">
           <img src="${data.image || 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80'}" alt="New Month" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" />
           <h2 style="font-size: 24px; margin-top: 0;">${data.title || 'Welcome to a Vibrant New Month Ahead!'}</h2>
           <p style="font-size: 15px; line-height: 1.6; color: #f8fafc;">${data.message}</p>
           <div style="margin-top: 30px; padding: 15px; background: #0f172a; text-align: center; border-radius: 8px;">
              <span style="font-weight: bold; color: white;">${data.tagline || 'Fresh month, fresh energy'}</span>
           </div>
           <p style="margin-top: 30px; font-size: 13px; text-align: center; color: #cbd5e1;">Stay up to date with the latest trends!!!<br/>Join us on all Social media platforms @thescpsn Today</p>
        </div>
      </div>
    `;
  }

  private buildSpotlightHtml(data: any): string {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #2f5a8a; border-radius: 16px; padding: 40px; text-align: center; color: white;">
        <p style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">Member Spotlight Feature</p>
        <h1 style="font-size: 36px; font-weight: 900; margin-top: 0; text-transform: uppercase;">Meet Our Member</h1>
        <div style="margin: 30px auto; width: 200px; height: 200px; border-radius: 100px; overflow: hidden; border: 4px solid white;">
           <img src="${data.image}" alt="${data.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h2 style="font-size: 20px; margin-bottom: 5px;">${data.name}</h2>
        <p style="font-size: 14px; margin-top: 0; color: #cbd5e1;">${data.designation}</p>
        ${data.bio ? `<p style="font-size: 14px; line-height: 1.6; margin-top: 20px; text-align: left;">${data.bio}</p>` : ''}
      </div>
    `;
  }

  private buildWebinarHtml(data: any): string {
    const speakersHtml = (data.speakers || []).map(s => `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${s.image}" alt="${s.name}" style="width: 100px; height: 100px; border-radius: 50px; object-fit: cover; border: 3px solid #7c3aed;" />
        <h3 style="font-size: 14px; margin: 10px 0 5px 0; color: #000;">${s.name}</h3>
        <p style="font-size: 11px; margin: 0; color: #e11d48;">${s.title}</p>
      </div>
    `).join('');

    return `
      <div style="font-family: sans-serif; max-width: 700px; margin: auto; display: table; width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="display: table-cell; width: 65%; vertical-align: top; background: white;">
           <div style="padding: 20px;">
             <h2 style="color: #cbd5e1; font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase;">SCPSN<br/>Monthly<br/>Webinar</h2>
           </div>
           <div style="background: #6d28d9; padding: 20px; color: white; border-top-right-radius: 20px; border-bottom-right-radius: 20px; margin-right: 20px;">
             <h3 style="font-size: 18px; margin: 0 0 10px 0;">THEME: ${data.theme}</h3>
             <p style="font-size: 14px; margin: 0;">Subtheme: ${data.subtheme}</p>
           </div>
           <div style="padding: 20px;">
              <table style="width: 100%;">
                <tr>
                  <td style="font-weight: bold; color: #0f172a;">📅 ${data.date}</td>
                  <td style="font-weight: bold; color: #0f172a;">🕒 ${data.time}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; background: #6d28d9; color: white; padding: 10px 20px; border-radius: 30px; display: inline-block; font-weight: bold;">
                VENUE: ${data.venue}
              </div>
           </div>
        </div>
        <div style="display: table-cell; width: 35%; vertical-align: top; background: #fdf4ff; border-left: 1px solid #e2e8f0;">
           <div style="background: #6d28d9; color: white; text-align: center; padding: 10px; font-weight: bold; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; margin: 0 10px 20px 10px;">
             THE SPEAKERS
           </div>
           <div style="padding: 0 10px;">
             ${speakersHtml}
           </div>
           <div style="background: #6d28d9; color: white; text-align: center; padding: 15px 10px; font-size: 12px; margin-top: 20px;">
             <strong>CHIEF HOST:</strong> ${data.chiefHost}<br/>
             <strong>HOST:</strong> ${data.host}
           </div>
        </div>
      </div>
      <div style="max-width: 700px; margin: auto; background: #6d28d9; color: white; text-align: center; padding: 10px; font-size: 12px; font-weight: bold; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
        Follow us on all Social media platforms @thescpsn!!!
      </div>
    `;
  }
}
