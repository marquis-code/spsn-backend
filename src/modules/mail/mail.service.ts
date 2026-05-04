import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY') || 'mock_key');
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'SCPSN <notifications@scpsn.org.ng>',
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Mail Error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Mail Exception:', err);
      return { success: false, error: err };
    }
  }

  async sendMembershipWelcome(email: string, fullName: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
        <h2 style="color: #003366; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: lowercase;">welcome to the registry, ${fullName.split(' ')[0]}</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 14px;">Your membership with the <strong>Society for Cellular Pathology Scientists of Nigeria</strong> has been successfully initialized.</p>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; font-weight: bold; color: #003366; text-transform: lowercase;">next steps:</p>
          <ul style="color: #64748b; font-size: 13px; margin-top: 10px; padding-left: 20px;">
            <li>Complete your scientific profile</li>
            <li>Upload your practicing license for validation</li>
            <li>Explore the pathological archives</li>
          </ul>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">This is a critical system notification from the SCPSN scientific network.</p>
      </div>
    `;
    return this.sendMail(email, 'scpsn - welcome to the scientific network', html);
  }

  async sendPaymentReceipt(email: string, paymentDetails: { amount: number; reference: string; purpose: string }) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
        <h2 style="color: #003366; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: lowercase;">payment successful</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 14px;">We have received your payment for <strong>${paymentDetails.purpose}</strong>.</p>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #94a3b8; padding-bottom: 10px; text-transform: lowercase;">amount:</td>
              <td style="color: #003366; font-weight: bold; text-align: right; padding-bottom: 10px;">NGN ${paymentDetails.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #94a3b8; text-transform: lowercase;">reference:</td>
              <td style="color: #003366; font-weight: bold; text-align: right;">${paymentDetails.reference}</td>
            </tr>
          </table>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">Thank you for your contribution to the scientific community.</p>
      </div>
    `;
    return this.sendMail(email, 'scpsn - payment confirmation', html);
  }
}
