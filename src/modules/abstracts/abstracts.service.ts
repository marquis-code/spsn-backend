import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Abstract, AbstractDocument } from './schemas/abstract.schema';
import { AbstractsGateway } from './abstracts.gateway';

@Injectable()
export class AbstractsService {
  constructor(
    @InjectModel(Abstract.name) private abstractModel: Model<AbstractDocument>,
    private readonly abstractsGateway: AbstractsGateway,
  ) {}

  async create(createAbstractDto: any): Promise<AbstractDocument> {
    const createdAbstract = new this.abstractModel(createAbstractDto);
    const saved = await createdAbstract.save();
    this.abstractsGateway.notifyNewAbstract(saved);
    return saved;
  }

  async findAll(): Promise<AbstractDocument[]> {
    return this.abstractModel.find().populate('conference').sort({ createdAt: -1 }).lean().exec() as any;
  }

  async findByConference(conferenceId: string): Promise<AbstractDocument[]> {
    return this.abstractModel.find({ conference: conferenceId }).lean().exec() as any;
  }

  async update(id: string, updateAbstractDto: any): Promise<AbstractDocument> {
    const updatedAbstract = await this.abstractModel
      .findByIdAndUpdate(id, updateAbstractDto, { new: true })
      .exec();
    if (!updatedAbstract) throw new NotFoundException('Abstract not found');
    return updatedAbstract;
  }

  async bulkUpsert(data: any[]): Promise<any> {
    const ops = data.map(item => ({
      updateOne: {
        filter: { title: item.title, author: item.author },
        update: { $set: item },
        upsert: true,
      },
    }));
    return this.abstractModel.bulkWrite(ops);
  }

  async findAllExport(): Promise<any[]> {
    return this.abstractModel.find().populate('conference', 'title').lean().exec();
  }
}
