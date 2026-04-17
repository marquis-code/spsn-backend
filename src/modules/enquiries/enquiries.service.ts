import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
  ) {}

  async create(createEnquiryDto: any): Promise<EnquiryDocument> {
    const createdEnquiry = new this.enquiryModel(createEnquiryDto);
    return createdEnquiry.save();
  }

  async findAll(): Promise<EnquiryDocument[]> {
    return this.enquiryModel.find().sort({ createdAt: -1 }).lean().exec() as any;
  }

  async findOne(id: string): Promise<EnquiryDocument> {
    const enquiry = await this.enquiryModel.findById(id).lean().exec();
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return enquiry as any;
  }

  async update(id: string, updateEnquiryDto: any): Promise<EnquiryDocument> {
    const updatedEnquiry = await this.enquiryModel
      .findByIdAndUpdate(id, updateEnquiryDto, { new: true })
      .exec();
    if (!updatedEnquiry) throw new NotFoundException('Enquiry not found');
    return updatedEnquiry;
  }

  async delete(id: string): Promise<any> {
    const result = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Enquiry not found');
    return result;
  }

  async bulkUpsert(data: any[]): Promise<any> {
    const ops = data.map(item => ({
      updateOne: {
        filter: { email: item.email, subject: item.subject },
        update: { $set: item },
        upsert: true,
      },
    }));
    return this.enquiryModel.bulkWrite(ops);
  }

  async findAllExport(): Promise<any[]> {
    return this.enquiryModel.find().lean().exec();
  }
}
