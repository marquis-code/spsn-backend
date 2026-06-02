import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
const PDFDocument = require('pdfkit');

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
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
    if (existing) {
      // Allow updates to pending users or renewals without throwing Conflict, handle directly
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }
      return this.update(existing._id.toString(), payload);
    }
    
    // Cache the registration payload
    await this.cacheManager.set(`signup_payload:${email}`, payload, 900000); // 15 minutes
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`signup_otp:${email}`, otp, 900000);
    
    // Send email
    await this.mailService.sendSignupOTP(email, otp);
    
    return {
      requiresOtp: true,
      email,
      message: 'A verification code has been sent to your email.'
    };
  }

  async verifyRegistration(email: string, otp: string) {
    const cachedOtp = await this.cacheManager.get(`signup_otp:${email}`);
    
    if (!cachedOtp) {
      throw new BadRequestException('OTP expired or invalid');
    }
    
    if (cachedOtp !== otp) {
      throw new BadRequestException('Invalid verification code');
    }
    
    const payload: any = await this.cacheManager.get(`signup_payload:${email}`);
    if (!payload) {
      throw new BadRequestException('Registration session expired. Please start over.');
    }
    
    // Create the member
    const member = await this.create(payload);
    
    // Generate PDF Certificate in memory
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
          margin: 50
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Certificate Design
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(10).stroke('#003366');
        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70).lineWidth(2).stroke('#2dd4a0');
        
        doc.fontSize(40).fillColor('#003366').text('Certificate of Joining', { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(20).fillColor('#64748b').text('Society for Cellular Pathology Scientists of Nigeria', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(16).fillColor('#94a3b8').text('This proudly certifies that', { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(32).fillColor('#0f4c35').text(member.fullName, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(16).fillColor('#64748b').text('has successfully completed registration and is now recognized as a member.', { align: 'center' });
        doc.moveDown(3);
        
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.fontSize(14).fillColor('#003366').text(`Date: ${date}`, 100, doc.page.height - 150);
        doc.text('SCPSN Registration Board', doc.page.width - 300, doc.page.height - 150, { align: 'right' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });

    // Send Welcome Email with Certificate attached
    await this.mailService.sendWelcomeWithCertificate(email, member.fullName, pdfBuffer);

    // Clear caches
    await this.cacheManager.del(`signup_otp:${email}`);
    await this.cacheManager.del(`signup_payload:${email}`);
    
    return member;
  }

  async resendRegistrationOtp(email: string) {
    const payload = await this.cacheManager.get(`signup_payload:${email}`);
    if (!payload) {
      throw new BadRequestException('Registration session not found or expired.');
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`signup_otp:${email}`, otp, 900000); // Reset timer
    
    await this.mailService.sendSignupOTP(email, otp);
    
    return { message: 'A new verification code has been sent.' };
  }

  async registerMember(payload: any): Promise<MemberDocument> {
    const { email, ...rest } = payload;
    const existing = await this.findByEmail(email);
    if (existing) {
      return this.update(existing._id.toString(), payload);
    }
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

    // Handle password hashing if being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Handle nested professionalProfile
    if (updateData.professionalProfile) {
      const existing = await this.memberModel.findById(id).select('professionalProfile').exec();
      if (existing) {
        updateData.professionalProfile = {
          ...existing.professionalProfile,
          ...updateData.professionalProfile
        };
      }
    }

    // Handle nested documents
    if (updateData.documents) {
      const existing = await this.memberModel.findById(id).select('documents').exec();
      if (existing) {
        updateData.documents = {
          ...existing.documents,
          ...updateData.documents
        };
      }
    }

    const updatedMember = await this.memberModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
    
    if (!updatedMember) throw new NotFoundException('Member not found');
    return updatedMember;
  }

  async delete(id: string): Promise<any> {
    const result = await this.memberModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Member not found');
    return result;
  }
}
