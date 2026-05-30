import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
  ) {}

  async create(createGalleryDto: any): Promise<Gallery> {
    const createdGallery = new this.galleryModel(createGalleryDto);
    return createdGallery.save();
  }

  async findAll(): Promise<Gallery[]> {
    return this.galleryModel.find().sort({ order: 1, createdAt: -1 }).exec();
  }

  async findActive(): Promise<Gallery[]> {
    return this.galleryModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Gallery> {
    const item = await this.galleryModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Gallery item #${id} not found`);
    }
    return item;
  }

  async update(id: string, updateGalleryDto: any): Promise<Gallery> {
    const existing = await this.galleryModel
      .findByIdAndUpdate(id, updateGalleryDto, { new: true })
      .exec();
    if (!existing) {
      throw new NotFoundException(`Gallery item #${id} not found`);
    }
    return existing;
  }

  async delete(id: string): Promise<Gallery> {
    const deleted = await this.galleryModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Gallery item #${id} not found`);
    }
    return deleted;
  }
}
