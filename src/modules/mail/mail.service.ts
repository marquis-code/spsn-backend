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
        from: 'SCPSN <notifications@scpsn.com>',
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
  async send2FAOTP(email: string, otp: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
        <h2 style="color: #003366; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: lowercase;">authentication required</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 14px;">A login attempt was made for your account. Please use the verification code below to securely access the platform.</p>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <h1 style="color: #003366; font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 4px;">${otp}</h1>
          <p style="margin-top: 10px; font-size: 12px; color: #94a3b8; text-transform: lowercase;">this code expires in 5 minutes</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">If you did not initiate this login, please contact the system administrator immediately.</p>
      </div>
    `;
    const res = await this.sendMail(email, 'scpsn - your login verification code', html);
    console.log(`[MailService] Sent 2FA OTP to ${email}, success: ${res.success}`);
    return res;
  }
  async sendPasswordResetMail(email: string, resetLink: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f4c35; font-size: 28px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 2px;">SCPSN</h1>
          <span style="color: #2dd4a0; font-size: 11px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase;">Secure Portal</span>
        </div>
        <h2 style="color: #003366; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 14px;">We received a request to reset the password for your administrative account. If you made this request, please click the button below to securely set a new password.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background-color: #0f4c35; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Reset Password</a>
        </div>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">If the button above does not work, copy and paste this link into your browser:</p>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #2dd4a0; word-break: break-all;">${resetLink}</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">If you did not initiate this request, please ignore this email or contact the system administrator immediately.</p>
      </div>
    `;
    const res = await this.sendMail(email, 'SCPSN - Password Reset Request', html);
    console.log(`[MailService] Sent Password Reset to ${email}, success: ${res.success}`);
    return res;
  }

  async sendAnnualDuesReminder(email: string, fullName: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
        <h2 style="color: #003366; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: lowercase;">annual dues reminder</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 14px;">Dear ${fullName}, this is a friendly reminder from the <strong>Society for Cellular Pathology Scientists of Nigeria</strong>.</p>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; font-weight: bold; color: #003366; text-transform: lowercase;">action required:</p>
          <ul style="color: #64748b; font-size: 13px; margin-top: 10px; padding-left: 20px; line-height: 1.8;">
            <li>Please ensure your annual dues for the current year are paid.</li>
            <li>Dues are payable in January of each year.</li>
            <li><strong>First-time members:</strong> ₦20,000</li>
            <li><strong>Returning members:</strong> ₦10,000</li>
            <li>Login to the Member Portal to securely upload your transfer receipt.</li>
          </ul>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">This is a system notification from the SCPSN administrative network.</p>
      </div>
    `;
    return this.sendMail(email, 'SCPSN - Annual Dues Payment Reminder', html);
  }
}
