import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdvertDocument = Advert & Document;

@Schema({ timestamps: true })
export class Advert {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  targetUrl: string;

  @Prop({ required: true, enum: ['BELOW_HERO', 'IN_CONTENT_1', 'ABOVE_FOOTER'] })
  section: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  clicks: number;

  @Prop()
  companyName: string;

  @Prop()
  contactPhone: string;

  @Prop()
  contactEmail: string;

  @Prop()
  contactAddress: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ type: [String], default: [] })
  benefits: string[];

  @Prop({ type: [String], default: [] })
  targetAudience: string[];
}

export const AdvertSchema = SchemaFactory.createForClass(Advert);
