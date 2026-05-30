import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NewsletterCategory } from './newsletter-category.schema';

export type NewsletterDocument = Newsletter & Document;

@Schema({ timestamps: true })
export class Newsletter {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  htmlContent: string;

  @Prop()
  bannerUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'NewsletterCategory', required: true })
  category: NewsletterCategory;

  @Prop({ required: true, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: string;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
