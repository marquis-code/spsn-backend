import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advert, AdvertDocument } from './schemas/advert.schema';

@Injectable()
export class AdvertsService {
  constructor(
    @InjectModel(Advert.name) private advertModel: Model<AdvertDocument>,
  ) {}

  async findAll() {
    return this.advertModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActiveGroupedBySection() {
    const adverts = await this.advertModel.find({ isActive: true }).exec();
    
    // Group them by section
    const grouped = adverts.reduce((acc, ad) => {
      if (!acc[ad.section]) acc[ad.section] = [];
      acc[ad.section].push(ad);
      return acc;
    }, {} as Record<string, AdvertDocument[]>);

    return grouped;
  }

  async findOne(id: string) {
    const advert = await this.advertModel.findById(id).exec();
    if (!advert) throw new NotFoundException('Advert not found');
    return advert;
  }

  async create(data: any) {
    const newAdvert = new this.advertModel(data);
    return newAdvert.save();
  }

  async update(id: string, data: any) {
    const updated = await this.advertModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Advert not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.advertModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Advert not found');
    return { message: 'Advert deleted successfully' };
  }

  async incrementClick(id: string) {
    const advert = await this.advertModel.findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true }).exec();
    if (!advert) throw new NotFoundException('Advert not found');
    return { success: true };
  }
}
