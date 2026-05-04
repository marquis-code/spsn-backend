import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter } from './schemas/newsletter.schema';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>,
  ) {}

  async subscribe(email: string): Promise<Newsletter> {
    try {
      const existing = await this.newsletterModel.findOne({ email });
      if (existing) {
        return existing;
      }
      const newSubscription = new this.newsletterModel({ email });
      return await newSubscription.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already subscribed');
      }
      throw error;
    }
  }

  async findAll(): Promise<Newsletter[]> {
    return this.newsletterModel.find().exec();
  }

  async unsubscribe(email: string): Promise<void> {
    await this.newsletterModel.updateOne({ email }, { isActive: false }).exec();
  }
}
