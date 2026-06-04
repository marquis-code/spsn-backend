import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as https from 'https';
import * as http from 'http';
const PDFDocument = require('pdfkit');

/* ─── Fetch remote image as Buffer ──────────────────────────────── */
function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const LOGO_URL = 'https://res.cloudinary.com/marquis/image/upload/v1780568451/logo_a92txk.jpg';

/* ─── Color palette ─────────────────────────────────────────────── */
const C = {
  navy:      '#1d4e89',
  navyDeep:  '#0f2d4f',
  gold:      '#c9993f',
  goldLight: '#e8c97a',
  cream:     '#fdfaf4',
  slate:     '#64748b',
  slateLight:'#94a3b8',
  white:     '#ffffff',
  teal:      '#0d9488',
  red:       '#be123c',
};

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(createMemberDto: any): Promise<MemberDocument> {
    if (createMemberDto.password) {
      createMemberDto.password = await bcrypt.hash(createMemberDto.password, 10);
    }
    const createdMember = new this.memberModel(createMemberDto);
    return createdMember.save();
  }

  async initiateRegistration(payload: any) {
    const { email } = payload;
    const existing = await this.findByEmail(email);
    if (existing && existing.status !== 'Pending') {
      throw new ConflictException('An active account with this email already exists.');
    }
    await this.cacheManager.set(`signup_payload:${email}`, payload, 900000);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`signup_otp:${email}`, otp, 900000);
    await this.mailService.sendSignupOTP(email, otp);
    return { requiresOtp: true, email, message: 'A verification code has been sent to your email.' };
  }

  async verifyRegistration(email: string, otp: string) {
    const cachedOtp = await this.cacheManager.get(`signup_otp:${email}`);
    if (!cachedOtp) throw new BadRequestException('OTP expired or invalid');
    if (cachedOtp !== otp) throw new BadRequestException('Invalid verification code');

    const payload: any = await this.cacheManager.get(`signup_payload:${email}`);
    if (!payload) throw new BadRequestException('Registration session expired. Please start over.');

    let member: any;
    const existing = await this.findByEmail(email);
    if (existing) {
      if (payload.password) payload.password = await bcrypt.hash(payload.password, 10);
      member = await this.update(existing._id.toString(), payload);
    } else {
      member = await this.create(payload);
    }

    /* ── Fetch logo once ───────────────────────────────────── */
    let logoBuffer: Buffer | null = null;
    try { logoBuffer = await fetchImageBuffer(LOGO_URL); } catch (_) {}

    /* ── Build both PDF pages ──────────────────────────────── */
    const pdfBuffer = await this.buildCertificateAndLetter(member.fullName, logoBuffer);

    await this.mailService.sendWelcomeWithCertificate(email, member.fullName, pdfBuffer);

    await this.cacheManager.del(`signup_otp:${email}`);
    await this.cacheManager.del(`signup_payload:${email}`);

    const userObj = member.toObject ? member.toObject() : member;
    if (userObj.password) delete userObj.password;
    const jwtPayload = { email: userObj.email, sub: userObj._id };
    return {
      user: { ...userObj, permissions: userObj.permissions || [] },
      token: this.jwtService.sign(jwtPayload),
    };
  }

  /* ══════════════════════════════════════════════════════════
     PDF: Certificate of Joining  +  President's Welcome Letter
  ══════════════════════════════════════════════════════════ */
  private buildCertificateAndLetter(fullName: string, logoBuffer: Buffer | null): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
        const buffers: Buffer[] = [];
        doc.on('data', (c: Buffer) => buffers.push(c));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        this.drawCertificatePage(doc, fullName, logoBuffer);
        this.drawPresidentLetterPage(doc, fullName, logoBuffer);

        doc.end();
      } catch (err) { reject(err); }
    });
  }

  /* ══════════════════════════════════════════════════════════
     PAGE 1 — Certificate of Joining
  ══════════════════════════════════════════════════════════ */
  private drawCertificatePage(doc: any, fullName: string, logoBuffer: Buffer | null) {
    doc.addPage({ size: 'A4', layout: 'landscape', margin: 0 });

    const W = doc.page.width;   // 841.89
    const H = doc.page.height;  // 595.28

    /* ── Background ── */
    doc.rect(0, 0, W, H).fill(C.cream);

    /* ── Navy left band ── */
    doc.rect(0, 0, 56, H).fill(C.navyDeep);
    /* Gold accent stripe inside navy band */
    doc.rect(48, 0, 8, H).fill(C.gold);

    /* ── Navy right band ── */
    doc.rect(W - 56, 0, 56, H).fill(C.navyDeep);
    doc.rect(W - 56, 0, 8, H).fill(C.gold);

    /* ── Top decorative bar ── */
    doc.rect(56, 0, W - 112, 6).fill(C.navy);
    doc.rect(56, 6, W - 112, 3).fill(C.gold);

    /* ── Bottom decorative bar ── */
    doc.rect(56, H - 9, W - 112, 6).fill(C.navy);
    doc.rect(56, H - 6, W - 112, 3).fill(C.gold);

    /* ── Corner ornaments (all four) ── */
    const ornamentCorners = [
      [56, 9], [W - 56 - 60, 9],
      [56, H - 69], [W - 56 - 60, H - 69],
    ];
    ornamentCorners.forEach(([cx, cy]) => {
      doc.rect(cx, cy, 60, 60).lineWidth(1.5).stroke(C.gold);
      doc.rect(cx + 5, cy + 5, 50, 50).lineWidth(0.5).stroke(C.goldLight);
      /* small diamond */
      doc
        .moveTo(cx + 30, cy + 8)
        .lineTo(cx + 52, cy + 30)
        .lineTo(cx + 30, cy + 52)
        .lineTo(cx + 8, cy + 30)
        .closePath()
        .lineWidth(0.8)
        .stroke(C.gold);
    });

    /* ── Horizontal rule lines ── */
    const rl = 80, rr = W - 80;
    doc.moveTo(rl, 78).lineTo(rr, 78).lineWidth(0.5).stroke(C.goldLight);
    doc.moveTo(rl, H - 78).lineTo(rr, H - 78).lineWidth(0.5).stroke(C.goldLight);

    /* ── Logo ── */
    const logoY = 88, logoSize = 72;
    const logoX = W / 2 - logoSize / 2;
    if (logoBuffer) {
      doc.image(logoBuffer, logoX, logoY, { width: logoSize, height: logoSize });
      /* circular clip ring */
      doc.circle(W / 2, logoY + logoSize / 2, logoSize / 2 + 4).lineWidth(1.5).stroke(C.gold);
    }

    const bodyTop = logoBuffer ? logoY + logoSize + 16 : 100;

    /* ── Society name ── */
    doc.font('Helvetica').fontSize(9).fillColor(C.teal)
       .text('SOCIETY FOR CELLULAR PATHOLOGY SCIENTISTS OF NIGERIA', rl, bodyTop, {
         width: rr - rl, align: 'center', characterSpacing: 2,
       });

    /* ── "Certificate of Joining" title ── */
    const titleY = bodyTop + 22;
    doc.font('Helvetica-Bold').fontSize(38).fillColor(C.navyDeep)
       .text('Certificate of Joining', rl, titleY, { width: rr - rl, align: 'center' });

    /* Gold underline */
    const titleW = 300;
    doc.moveTo(W / 2 - titleW / 2, titleY + 50)
       .lineTo(W / 2 + titleW / 2, titleY + 50)
       .lineWidth(2).stroke(C.gold);
    doc.moveTo(W / 2 - titleW / 2 + 20, titleY + 54)
       .lineTo(W / 2 + titleW / 2 - 20, titleY + 54)
       .lineWidth(0.6).stroke(C.goldLight);

    /* ── "This is to certify that" ── */
    doc.font('Helvetica').fontSize(12).fillColor(C.slate)
       .text('This is to proudly certify that', rl, titleY + 68, { width: rr - rl, align: 'center' });

    /* ── Recipient name ── */
    const nameY = titleY + 96;
    /* subtle name band */
    doc.rect(rl + 80, nameY - 8, rr - rl - 160, 52).fill('#f0e9d2');
    doc.font('Helvetica-BoldOblique').fontSize(30).fillColor(C.navyDeep)
       .text(fullName, rl, nameY, { width: rr - rl, align: 'center' });

    /* ── Body copy ── */
    const copyY = nameY + 62;
    doc.font('Helvetica').fontSize(11).fillColor(C.slate)
       .text(
         'has successfully completed all registration requirements and is hereby duly recognized\n' +
         'as a valued member of the Society for Cellular Pathology Scientists of Nigeria.',
         rl, copyY, { width: rr - rl, align: 'center', lineGap: 4 }
       );

    /* ── Date + seal area ── */
    const footY = H - 130;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    /* Left: date */
    doc.font('Helvetica').fontSize(10).fillColor(C.slate)
       .text('Date of Admission', rl + 30, footY, { width: 140, align: 'center' });
    doc.moveTo(rl + 30, footY + 14).lineTo(rl + 170, footY + 14).lineWidth(0.8).stroke(C.gold);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.navyDeep)
       .text(dateStr, rl + 30, footY + 18, { width: 140, align: 'center' });

    /* Center: SCPSN seal circle */
    const sealX = W / 2, sealY = footY + 18;
    doc.circle(sealX, sealY, 34).lineWidth(2).stroke(C.navy);
    doc.circle(sealX, sealY, 28).lineWidth(0.6).stroke(C.gold);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C.navy)
       .text('SCPSN', sealX - 20, sealY - 9, { width: 40, align: 'center' });
    doc.font('Helvetica').fontSize(6).fillColor(C.gold)
       .text('OFFICIAL SEAL', sealX - 24, sealY + 5, { width: 48, align: 'center', characterSpacing: 1 });

    /* Right: Registrar signature line */
    doc.font('Helvetica').fontSize(10).fillColor(C.slate)
       .text('Registrar, SCPSN', rr - 170, footY, { width: 140, align: 'center' });
    doc.moveTo(rr - 170, footY + 14).lineTo(rr - 30, footY + 14).lineWidth(0.8).stroke(C.gold);
    doc.font('Helvetica-BoldOblique').fontSize(11).fillColor(C.navyDeep)
       .text('SCPSN Board', rr - 170, footY + 18, { width: 140, align: 'center' });

    /* ── Member ID watermark ── */
    doc.save();
    doc.opacity(0.04);
    doc.font('Helvetica-Bold').fontSize(80).fillColor(C.navy)
       .text('SCPSN', 0, H / 2 - 60, { width: W, align: 'center' });
    doc.restore();
  }

  /* ══════════════════════════════════════════════════════════
     PAGE 2 — President's Welcome Letter
  ══════════════════════════════════════════════════════════ */
  private drawPresidentLetterPage(doc: any, fullName: string, logoBuffer: Buffer | null) {
    doc.addPage({ size: 'A4', layout: 'portrait', margin: 0 });

    const W = doc.page.width;   // 595.28
    const H = doc.page.height;  // 841.89

    /* ── Cream background ── */
    doc.rect(0, 0, W, H).fill(C.cream);

    /* ── Left accent strip ── */
    doc.rect(0, 0, 5, H).fill(C.gold);
    doc.rect(5, 0, 2, H).fill(C.goldLight);

    /* ── Right accent strip ── */
    doc.rect(W - 5, 0, 5, H).fill(C.gold);
    doc.rect(W - 7, 0, 2, H).fill(C.goldLight);

    /* ── Top header band ── */
    doc.rect(0, 0, W, 90).fill(C.navyDeep);

    /* Logo in header */
    const lhSize = 54;
    const lhX = 22, lhY = (90 - lhSize) / 2;
    if (logoBuffer) {
      doc.image(logoBuffer, lhX, lhY, { width: lhSize, height: lhSize });
    }

    /* Society name in header */
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C.white)
       .text('Society for Cellular Pathology Scientists of Nigeria', lhX + lhSize + 14, 24, {
         width: W - lhX - lhSize - 36,
       });
    doc.font('Helvetica').fontSize(9).fillColor(C.goldLight)
       .text('SCPSN — Official Correspondence', lhX + lhSize + 14, 46, {
         width: W - lhX - lhSize - 36, characterSpacing: 1,
       });

    /* Gold bar below header */
    doc.rect(0, 90, W, 4).fill(C.gold);
    doc.rect(0, 94, W, 1.5).fill(C.goldLight);

    const margin = 52;
    const contentW = W - margin * 2;
    let y = 118;

    /* ── Date line ── */
    const dateStr = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    doc.font('Helvetica').fontSize(10).fillColor(C.slateLight)
       .text(dateStr, margin, y, { width: contentW, align: 'right' });
    y += 28;

    /* ── "Dear [Name]" ── */
    doc.font('Helvetica-Bold').fontSize(14).fillColor(C.navyDeep)
       .text(`Dear ${fullName},`, margin, y);
    y += 30;

    /* ── Gold rule ── */
    doc.moveTo(margin, y).lineTo(margin + 160, y).lineWidth(1.5).stroke(C.gold);
    y += 14;

    /* ── Subject line ── */
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.navy)
       .text('Re: A Warm Welcome to the Society for Cellular Pathology Scientists of Nigeria', margin, y, {
         width: contentW,
       });
    y += 36;

    /* ── Body paragraphs ── */
    const bodyStyle = { font: 'Helvetica', size: 11, color: '#334155', gap: 5, indent: 0 };

    const paragraphs = [
      `On behalf of the entire Board, Executive Council, and the remarkable family of scientists that make up the Society for Cellular Pathology Scientists of Nigeria, I extend to you the warmest, most heartfelt welcome. Today is not simply the day you completed a registration form — today is the day you joined a movement.`,

      `SCPSN was founded on a dream: that the men and women who dedicate their lives to the silent, painstaking, and profoundly important work of cellular pathology would one day have a home. A place of belonging. A community that understands the weight of a diagnosis, the precision demanded of our craft, and the quiet pride we carry as custodians of truth at the cellular level. You are now part of that dream.`,

      `I want you to know — truly know — that your presence here matters. Every member who joins our ranks strengthens the collective voice of cellular pathology scientists across Nigeria. You bring your unique training, your experiences, your vision, and your passion, and in doing so, you make us better. You make this country's healthcare ecosystem stronger.`,

      `There will be moments ahead — conferences where brilliant minds collide, publications that challenge what we thought we knew, policy conversations where your expertise will shape legislation. I urge you to lean into all of it. Ask questions. Lead workshops. Mentor those who come after you. This society is only as powerful as the energy you choose to pour into it.`,

      `To you, a fellow scientist of cells and truth: welcome home. We have been waiting for you.`,
    ];

    paragraphs.forEach((para, i) => {
      doc.font(bodyStyle.font).fontSize(bodyStyle.size).fillColor(bodyStyle.color)
         .text(para, margin, y, { width: contentW, align: 'justify', lineGap: bodyStyle.gap });
      y += doc.heightOfString(para, { width: contentW, lineGap: bodyStyle.gap }) + (i < paragraphs.length - 1 ? 14 : 20);
    });

    /* ── Closing ── */
    doc.font('Helvetica').fontSize(11).fillColor(C.slate)
       .text('Yours faithfully, with great pride and honour,', margin, y);
    y += 20;

    /* Signature flourish */
    doc.font('Helvetica-BoldOblique').fontSize(18).fillColor(C.navyDeep)
       .text('The President', margin, y);
    y += 24;
    doc.font('Helvetica').fontSize(10).fillColor(C.teal)
       .text('Society for Cellular Pathology Scientists of Nigeria', margin, y);
    y += 14;
    doc.moveTo(margin, y).lineTo(margin + 200, y).lineWidth(1).stroke(C.gold);

    /* ── Decorative bottom band ── */
    doc.rect(0, H - 32, W, 32).fill(C.navyDeep);
    doc.rect(0, H - 32, W, 3).fill(C.gold);
    doc.font('Helvetica').fontSize(8).fillColor(C.slateLight)
       .text('SCPSN  ·  Chemical Laboratory, National Hospital Abuja  ·  info@scpsn.org.ng', 0, H - 20, {
         width: W, align: 'center', characterSpacing: 0.5,
       });
  }

  /* ─── Remaining service methods (unchanged) ──────────────────── */

  async resendRegistrationOtp(email: string) {
    const payload = await this.cacheManager.get(`signup_payload:${email}`);
    if (!payload) throw new BadRequestException('Registration session not found or expired.');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`signup_otp:${email}`, otp, 900000);
    await this.mailService.sendSignupOTP(email, otp);
    return { message: 'A new verification code has been sent.' };
  }

  async registerMember(payload: any): Promise<MemberDocument> {
    const { email } = payload;
    const existing = await this.findByEmail(email);
    if (existing) return this.update(existing._id.toString(), payload);
    return this.create(payload);
  }

  async findAll(): Promise<MemberDocument[]> {
    return this.memberModel.find().sort({ createdAt: -1 }).lean().exec() as any;
  }

  async findBoardMembers(): Promise<MemberDocument[]> {
    return this.memberModel.find({ isBoardMember: true, isActive: true }).sort({ createdAt: -1 }).lean().exec() as any;
  }

  async findOne(id: string): Promise<MemberDocument> {
    const member = await this.memberModel.findById(id).lean().exec();
    if (!member) throw new NotFoundException('Member not found');
    return member as any;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<MemberDocument | null> {
    return this.memberModel.findOne({ firebaseUid }).lean().exec() as any;
  }

  async findByEmail(email: string): Promise<MemberDocument | null> {
    return this.memberModel.findOne({ email }).lean().exec() as any;
  }

  async update(id: string, updateMemberDto: any): Promise<MemberDocument> {
    const updateData: any = { ...updateMemberDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.professionalProfile) {
      const existing = await this.memberModel.findById(id).select('professionalProfile').exec();
      if (existing) {
        updateData.professionalProfile = { ...existing.professionalProfile, ...updateData.professionalProfile };
      }
    }
    if (updateData.documents) {
      const existing = await this.memberModel.findById(id).select('documents').exec();
      if (existing) {
        updateData.documents = { ...existing.documents, ...updateData.documents };
      }
    }
    const updatedMember = await this.memberModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).exec();
    if (!updatedMember) throw new NotFoundException('Member not found');
    return updatedMember;
  }

  async delete(id: string): Promise<any> {
    const result = await this.memberModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Member not found');
    return result;
  }
}