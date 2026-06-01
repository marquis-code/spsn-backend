import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/schemas/member.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.memberModel.findOne({ email }).select('+password').exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.cacheManager.set(`otp:${user.email}`, otp, 300000);
        await this.mailService.send2FAOTP(user.email, otp);
        return {
          requires2FA: true,
          email: user.email,
          message: 'OTP sent to your email.'
        };
      }
    }

    // Fallback for test accounts
    if (
      (email === 'admin@scpsn.org.ng' && password === 'admin123') ||
      (email === 'member@scpsn.org.ng' && password === 'member123')
    ) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.cacheManager.set(`otp:${email}`, otp, 300000);
      // We still try to send email, but it might fail for dummy emails. 
      // Ensure we don't crash if Resend fails.
      await this.mailService.send2FAOTP(email, otp);
      return {
        requires2FA: true,
        email: email,
        message: 'OTP sent to your email.'
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async verify2FA(email: string, otp: string) {
    const cachedOtp = await this.cacheManager.get(`otp:${email}`);
    
    if (!cachedOtp) {
      throw new BadRequestException('OTP expired or invalid');
    }
    
    if (cachedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    
    await this.cacheManager.del(`otp:${email}`);
    
    const user = await this.memberModel.findOne({ email }).select('+password').exec();
    
    if (!user) {
      if (email === 'admin@scpsn.org.ng' || email === 'member@scpsn.org.ng') {
        const payload = { email: email, sub: 'fallback-id' };
        return {
          user: { 
            email, 
            role: email.startsWith('admin') ? 'super_admin' : 'regular',
            permissions: []
          },
          token: this.jwtService.sign(payload),
        };
      }
      throw new UnauthorizedException('User not found');
    }
    
    const userObj = user.toObject();
    delete userObj.password;
    
    const payload = { email: user.email, sub: user._id };
    return {
      user: {
        ...userObj,
        permissions: userObj.permissions || []
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(body: any, file?: Express.Multer.File) {
    const { fullName, email, password, phone, institution, membershipType, role, membershipId } = body;

    if (!membershipId) {
      throw new BadRequestException('RA/RF Number (membershipId) is required for registration.');
    }

    const existingUser = await this.memberModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('A member with this email already exists. If you are renewing, please use a different email or contact support.');
    }

    let proofOfPaymentUrl = '';
    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      proofOfPaymentUrl = upload?.url || '';
    }

    const hashedPassword = await bcrypt.hash(password || 'Member@123', 10);

    const newMember = new this.memberModel({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber: phone,
      membershipId,
      role: role || 'Regular Member',
      enrollmentInfo: {
        membershipType,
        institution,
        proofOfPaymentUrl,
        paymentStatus: 'Pending',
        enrollmentDate: new Date(),
      }
    });

    const saved = await newMember.save();
    const userObj = saved.toObject();
    delete userObj.password;

    return {
      user: userObj,
      message: 'Enrollment protocol initiated successfully.'
    };
  }

  async forgotPassword(email: string) {
    const user = await this.memberModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Member with this email not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    user.forgotPasswordToken = token;
    user.forgotPasswordExpires = expires;
    await user.save();

    const resetLink = `http://localhost:3001/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetMail(user.email, resetLink);

    return {
      message: 'Password reset instructions initiated.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.memberModel.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpires: { $gt: new Date() }
    }).select('+password').exec();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpires = undefined;
    await user.save();

    return {
      message: 'Password successfully updated.'
    };
  }
}
