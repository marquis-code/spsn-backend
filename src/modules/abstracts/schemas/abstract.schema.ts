import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AbstractDocument = Abstract & Document;

@Schema({ timestamps: true })
export class Abstract {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  abstractBody: string;

  @Prop({ required: false })
  fileUrl: string;

  @Prop({ required: true })
  primaryAuthor: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  affiliation: string;

  @Prop([String])
  keywords: string[];

  @Prop({ type: String, required: false, index: true })
  conference: string;

  @Prop({ default: 'pending', enum: ['pending', 'under_review', 'accepted', 'rejected'], index: true })
  status: string;

  @Prop()
  reviewerNotes: string;

  @Prop()
  presentationType: string; // Oral, Poster, etc.
}

export const AbstractSchema = SchemaFactory.createForClass(Abstract);
