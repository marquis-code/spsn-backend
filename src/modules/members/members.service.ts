import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async create(createMemberDto: any): Promise<MemberDocument> {
    if (createMemberDto.password) {
      createMemberDto.password = await bcrypt.hash(createMemberDto.password, 10);
    }
    const createdMember = new this.memberModel(createMemberDto);
    return createdMember.save();
  }

  async registerMember(payload: any): Promise<MemberDocument> {
    const { email, ...rest } = payload;
    const existing = await this.findByEmail(email);
    if (existing) {
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }
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
