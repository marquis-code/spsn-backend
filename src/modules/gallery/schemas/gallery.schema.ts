import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ default: '' })
  title: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 'general' })
  category: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
