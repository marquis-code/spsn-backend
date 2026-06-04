import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY') || 'mock_key');
  }

  private getBaseTemplate(content: string, accentLabel = 'Official Notification'): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SCPSN</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- ── HEADER ───────────────────────────────────────── -->
          <tr>
            <td style="background-color:#1d4e89;border-radius:20px 20px 0 0;padding:36px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img
                      src="https://res.cloudinary.com/marquis/image/upload/v1780568451/logo_a92txk.jpg"
                      alt="SCPSN"
                      style="height:52px;width:auto;border-radius:10px;display:block;"
                    />
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;background-color:rgba(255,255,255,0.12);color:#bfdbfe;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);">
                      ${accentLabel}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:20px;">
                    <div style="height:1px;background:linear-gradient(to right,rgba(255,255,255,0.2),rgba(255,255,255,0.05));"></div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;">
                    <p style="margin:0;color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;">Society for Cellular Pathology Scientists of Nigeria</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">
              ${content}
            </td>
          </tr>

          <!-- ── FOOTER ──────────────────────────────────────── -->
          <tr>
            <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 20px 20px;padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.7;">
                      This is an automated message from the SCPSN registry.<br/>Please do not reply directly to this email.
                    </p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#cbd5e1;white-space:nowrap;">&copy; ${new Date().getFullYear()} SCPSN</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;
  }

  /* ─── Reusable inner-card block ─────────────────────────── */
  private infoCard(label: string, rows: string[]): string {
    const items = rows
      .map(r => `<li style="margin:0;padding:6px 0;font-size:13px;color:#475569;line-height:1.7;border-bottom:1px solid #f1f5f9;">${r}</li>`)
      .join('');
    return `
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;margin-top:24px;">
        <p style="margin:0 0 12px;font-size:10px;font-weight:800;color:#2563eb;letter-spacing:2px;text-transform:uppercase;">${label}</p>
        <ul style="margin:0;padding:0;list-style:none;">${items}</ul>
      </div>
    `;
  }

  private primaryButton(text: string, href: string): string {
    return `
      <div style="text-align:center;margin:28px 0;">
        <a href="${href}" style="display:inline-block;background-color:#1d4e89;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.3px;">${text}</a>
      </div>
    `;
  }

  private otpBlock(code: string, expiry: string): string {
    return `
      <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:36px 24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:800;color:#3b82f6;letter-spacing:3px;text-transform:uppercase;">Verification Code</p>
        <p style="margin:0;font-size:44px;font-weight:900;color:#1d4e89;letter-spacing:12px;line-height:1.2;">${code}</p>
        <p style="margin:12px 0 0;font-size:11px;font-weight:600;color:#60a5fa;text-transform:uppercase;letter-spacing:1.5px;">Expires in ${expiry}</p>
      </div>
    `;
  }

  /* ─── Send ──────────────────────────────────────────────── */
  async sendMail(to: string, subject: string, html: string, attachments?: any[]) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'SCPSN <notifications@scpsn.com>',
        to,
        subject,
        html,
        attachments,
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

  /* ─── Membership Welcome ────────────────────────────────── */
  async sendMembershipWelcome(email: string, fullName: string) {
    const firstName = fullName.split(' ')[0];
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Membership Confirmed</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Welcome aboard, ${firstName}.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        Your membership with the Society for Cellular Pathology Scientists of Nigeria has been successfully initialized. We are honoured to have you join our scientific community.
      </p>
      ${this.infoCard('Next Steps', [
        '✦ &nbsp;Complete your scientific profile',
        '✦ &nbsp;Upload your practicing license for validation',
        '✦ &nbsp;Explore the pathological archives',
        '✦ &nbsp;Connect with fellow pathology scientists',
      ])}
    `;
    return this.sendMail(email, 'SCPSN — Welcome to the Scientific Network', this.getBaseTemplate(content, 'Membership'));
  }

  /* ─── Payment Receipt ───────────────────────────────────── */
  async sendPaymentReceipt(email: string, paymentDetails: { amount: number; reference: string; purpose: string }) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Payment Confirmed</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Payment received.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        We have received your payment for <strong style="color:#1d4e89;">${paymentDetails.purpose}</strong>. Thank you for your contribution to the scientific community.
      </p>
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;margin-top:24px;">
        <p style="margin:0 0 14px;font-size:10px;font-weight:800;color:#2563eb;letter-spacing:2px;text-transform:uppercase;">Receipt Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#64748b;font-weight:600;padding-bottom:10px;">Purpose</td>
            <td align="right" style="font-size:13px;color:#0f172a;font-weight:700;padding-bottom:10px;">${paymentDetails.purpose}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#64748b;font-weight:600;padding-bottom:10px;border-top:1px dashed #e2e8f0;padding-top:10px;">Amount</td>
            <td align="right" style="font-size:18px;color:#1d4e89;font-weight:900;border-top:1px dashed #e2e8f0;padding-top:10px;">₦${paymentDetails.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#64748b;font-weight:600;border-top:1px dashed #e2e8f0;padding-top:10px;">Reference</td>
            <td align="right" style="font-size:12px;color:#1d4e89;font-weight:700;border-top:1px dashed #e2e8f0;padding-top:10px;font-family:monospace;">${paymentDetails.reference}</td>
          </tr>
        </table>
      </div>
    `;
    return this.sendMail(email, 'SCPSN — Payment Confirmation', this.getBaseTemplate(content, 'Finance'));
  }

  /* ─── 2FA OTP ───────────────────────────────────────────── */
  async send2FAOTP(email: string, otp: string) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Security Alert</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Authentication required.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        A login attempt was detected on your account. Use the code below to complete verification.
      </p>
      ${this.otpBlock(otp, '5 minutes')}
      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.7;">
        If you did not initiate this login, contact the system administrator immediately.
      </p>
    `;
    const res = await this.sendMail(email, 'SCPSN — Your Login Verification Code', this.getBaseTemplate(content, 'Security'));
    console.log(`[MailService] Sent 2FA OTP to ${email}, success: ${res.success}`);
    return res;
  }

  /* ─── Signup OTP ────────────────────────────────────────── */
  async sendSignupOTP(email: string, otp: string) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Registration</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Verify your email address.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        Thank you for registering with the Society for Cellular Pathology Scientists of Nigeria. Enter the code below to confirm your email and complete registration.
      </p>
      ${this.otpBlock(otp, '15 minutes')}
      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.7;">
        If you did not initiate this registration, you may safely ignore this email.
      </p>
    `;
    const res = await this.sendMail(email, 'SCPSN — Registration Verification Code', this.getBaseTemplate(content, 'Onboarding'));
    console.log(`[MailService] Sent Signup OTP to ${email}, success: ${res.success}`);
    return res;
  }

  /* ─── Welcome + Certificate ─────────────────────────────── */
  async sendWelcomeWithCertificate(email: string, fullName: string, pdfBuffer: Buffer) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Account Verified</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Welcome to SCPSN, ${fullName.split(' ')[0]}.</h2>
      <p style="margin:0 0 16px;font-size:14px;color:#64748b;line-height:1.8;">
        Congratulations — your account has been fully verified. Attached is your official <strong style="color:#1d4e89;">Certificate of Joining</strong>.
      </p>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        We are thrilled to have <strong>${fullName}</strong> as part of the Society for Cellular Pathology Scientists of Nigeria.
      </p>
      ${this.infoCard('Getting Started', [
        '✦ &nbsp;Login to the Member Portal',
        '✦ &nbsp;Complete your scientific profile',
        '✦ &nbsp;Connect with other pathology scientists',
      ])}
    `;
    const attachments = [{ filename: 'SCPSN_Certificate.pdf', content: pdfBuffer }];
    const res = await this.sendMail(email, 'SCPSN — Welcome & Certificate of Joining', this.getBaseTemplate(content, 'Onboarding'), attachments);
    console.log(`[MailService] Sent Welcome with Certificate to ${email}, success: ${res.success}`);
    return res;
  }

  /* ─── Password Reset ────────────────────────────────────── */
  async sendPasswordResetMail(email: string, resetLink: string) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Account Security</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Reset your password.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        We received a request to reset the password for your account. Click the button below to set a new password securely.
      </p>
      ${this.primaryButton('Reset Password', resetLink)}
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-top:4px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Or copy this link into your browser</p>
        <p style="margin:0;font-size:12px;color:#2563eb;word-break:break-all;font-family:monospace;line-height:1.7;">${resetLink}</p>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.7;">
        If you did not request a password reset, please ignore this email or contact the system administrator.
      </p>
    `;
    const res = await this.sendMail(email, 'SCPSN — Password Reset Request', this.getBaseTemplate(content, 'Security'));
    console.log(`[MailService] Sent Password Reset to ${email}, success: ${res.success}`);
    return res;
  }

  /* ─── Annual Dues Reminder ──────────────────────────────── */
  async sendAnnualDuesReminder(email: string, fullName: string) {
    const content = `
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2563eb;letter-spacing:2.5px;text-transform:uppercase;">Action Required</p>
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0f172a;line-height:1.2;">Annual dues reminder.</h2>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.8;">
        Dear <strong style="color:#1d4e89;">${fullName}</strong>, this is a friendly reminder regarding your annual membership dues for the current year.
      </p>
      ${this.infoCard('Payment Details', [
        '✦ &nbsp;Dues are payable in <strong>January</strong> of each year',
        '✦ &nbsp;<strong>First-time members:</strong> ₦20,000',
        '✦ &nbsp;<strong>Returning members:</strong> ₦10,000',
        '✦ &nbsp;Login to the Member Portal to upload your transfer receipt',
      ])}
    `;
    return this.sendMail(email, 'SCPSN — Annual Dues Payment Reminder', this.getBaseTemplate(content, 'Finance'));
  }
}