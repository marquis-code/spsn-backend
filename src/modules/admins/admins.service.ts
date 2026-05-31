import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Member, MemberDocument } from '../members/schemas/member.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(createAdminDto: any): Promise<Member> {
    const existing = await this.memberModel.findOne({ email: createAdminDto.email }).exec();
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password || 'Admin@123', 10);

    const newAdmin = new this.memberModel({
      ...createAdminDto,
      password: hashedPassword,
      role: 'admin',
      status: 'Active',
      permissions: createAdminDto.permissions || [],
    });

    const saved = await newAdmin.save();
    const adminObj = saved.toObject();
    delete adminObj.password;
    return adminObj;
  }

  async findAll(): Promise<Member[]> {
    return this.memberModel.find({ role: { $in: ['admin', 'super_admin'] } }).exec();
  }

  async update(id: string, updateAdminDto: any): Promise<Member> {
    const admin = await this.memberModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    const updated = await this.memberModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
      
    if (!updated) {
      throw new NotFoundException(`Admin with ID ${id} not found after update`);
    }

    const adminObj = updated.toObject();
    delete adminObj.password;
    return adminObj;
  }

  async delete(id: string): Promise<any> {
    const admin = await this.memberModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    if (admin.role === 'super_admin') {
      throw new ConflictException('Cannot delete a super admin directly');
    }

    return this.memberModel.findByIdAndDelete(id).exec();
  }
}
