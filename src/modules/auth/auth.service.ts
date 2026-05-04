import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/schemas/member.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.memberModel.findOne({ email }).select('+password').exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userObj = user.toObject();
        delete userObj.password;

        const payload = { email: user.email, sub: user._id };
        return {
          user: userObj,
          token: this.jwtService.sign(payload),
        };
      }
    }

    // Fallback for test accounts
    if (
      (email === 'admin@scpsn.org.ng' && password === 'admin123') ||
      (email === 'member@scpsn.org.ng' && password === 'member123')
    ) {
      const payload = { email: user.email, sub: user._id };
      return {
        user,
        token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async register(body: any, file?: Express.Multer.File) {
    const { fullName, email, password, phone, institution, membershipType, role } = body;

    const existingUser = await this.memberModel.findOne({ email }).exec();
    if (existingUser) {
      throw new UnauthorizedException('Member with this email already exists');
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

    // In a real app, send email here. For now, we return the token for testing.
    return {
      message: 'Password reset instructions initiated.',
      token: token // This should be sent via email in production
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
