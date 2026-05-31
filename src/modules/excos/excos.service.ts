import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exco, ExcoDocument } from './schemas/exco.schema';

@Injectable()
export class ExcosService {
  constructor(
    @InjectModel(Exco.name) private readonly excoModel: Model<ExcoDocument>,
  ) {}

  async create(createExcoDto: any): Promise<Exco> {
    const newExco = new this.excoModel(createExcoDto);
    return newExco.save();
  }

  async findAll(): Promise<Exco[]> {
    return this.excoModel.find().exec();
  }

  async findOne(id: string): Promise<Exco> {
    const exco = await this.excoModel.findById(id).exec();
    if (!exco) {
      throw new NotFoundException(`Exco with ID ${id} not found`);
    }
    return exco;
  }

  async update(id: string, updateExcoDto: any): Promise<Exco> {
    const existingExco = await this.excoModel
      .findByIdAndUpdate(id, updateExcoDto, { new: true })
      .exec();
    if (!existingExco) {
      throw new NotFoundException(`Exco with ID ${id} not found`);
    }
    return existingExco;
  }

  async delete(id: string): Promise<any> {
    const deletedExco = await this.excoModel.findByIdAndDelete(id).exec();
    if (!deletedExco) {
      throw new NotFoundException(`Exco with ID ${id} not found`);
    }
    return deletedExco;
  }
}
