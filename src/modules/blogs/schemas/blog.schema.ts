import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  coverImage: string;

  @Prop({ default: 'published', enum: ['draft', 'published', 'archived'], index: true })
  status: string;

  @Prop({ default: 'news', enum: ['news', 'newsletter', 'journal'], index: true })
  type: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  author: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
