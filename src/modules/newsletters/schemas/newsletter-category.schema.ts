import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterCategoryDocument = NewsletterCategory & Document;

@Schema({ timestamps: true })
export class NewsletterCategory {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const NewsletterCategorySchema = SchemaFactory.createForClass(NewsletterCategory);
