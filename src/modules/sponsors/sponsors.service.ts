import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sponsor, SponsorDocument } from './schemas/sponsor.schema';

@Injectable()
export class SponsorsService {
  constructor(
    @InjectModel(Sponsor.name) private sponsorModel: Model<SponsorDocument>,
  ) {}

  async findAll() {
    return this.sponsorModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActive() {
    return this.sponsorModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const sponsor = await this.sponsorModel.findById(id).exec();
    if (!sponsor) throw new NotFoundException('Sponsor not found');
    return sponsor;
  }

  async create(data: any) {
    const newSponsor = new this.sponsorModel(data);
    return newSponsor.save();
  }

  async update(id: string, data: any) {
    const updated = await this.sponsorModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Sponsor not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.sponsorModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Sponsor not found');
    return { message: 'Sponsor deleted successfully' };
  }
}
