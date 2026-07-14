import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Digest, DigestDocument } from './schemas/digest.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

const { compressPdf } = require('pdfpressor');

async function compressIfLarge(file: any): Promise<any> {
  // Cloudinary limit is 10MB, we aggressively shrink if > 8MB
  if (file.buffer && file.buffer.length > 8 * 1024 * 1024) {
    const tempId = crypto.randomUUID();
    const inputPath = path.join(os.tmpdir(), `${tempId}_in.pdf`);
    const outputPath = path.join(os.tmpdir(), `${tempId}_out.pdf`);
    
    try {
      fs.writeFileSync(inputPath, file.buffer);
      await compressPdf(inputPath, outputPath, 100, 60, true);
      const newBuffer = fs.readFileSync(outputPath);
      file.buffer = newBuffer;
      file.size = newBuffer.length;
      console.log(`Shrunk PDF from ${fs.statSync(inputPath).size} to ${file.size}`);
    } catch (error) {
      console.error('PDF compression failed:', error);
    } finally {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
  return file;
}

@Injectable()
export class DigestsService {
  constructor(
    @InjectModel(Digest.name) private digestModel: Model<DigestDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(data: { title: string; year: number }, file: any): Promise<Digest> {
    let pdfUrl = '';
    if (file) {
      const compressedFile = await compressIfLarge(file);
      const uploadResult = await this.cloudinaryService.uploadFileChunked(compressedFile, 'digests');
      pdfUrl = uploadResult.secure_url;
    }

    const newDigest = new this.digestModel({
      ...data,
      pdfUrl,
    });
    return newDigest.save();
  }

  async findAll(): Promise<Digest[]> {
    return this.digestModel.find().sort({ year: -1, createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<DigestDocument> {
    const digest = await this.digestModel.findById(id).exec();
    if (!digest) {
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return digest;
  }

  async update(id: string, data: { title?: string; year?: number }, file?: any): Promise<Digest> {
    const digest = await this.findOne(id);
    
    if (file) {
      const compressedFile = await compressIfLarge(file);
      const uploadResult = await this.cloudinaryService.uploadFileChunked(compressedFile, 'digests');
      digest.pdfUrl = uploadResult.secure_url;
    }

    if (data.title) digest.title = data.title;
    if (data.year) digest.year = Number(data.year);

    return digest.save();
  }

  async remove(id: string): Promise<any> {
    const digest = await this.findOne(id);
    return this.digestModel.findByIdAndDelete(id).exec();
  }
}
