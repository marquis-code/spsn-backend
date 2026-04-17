import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AbstractDocument = Abstract & Document;

@Schema({ timestamps: true })
export class Abstract {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  authorEmail: string;

  @Prop({ type: Types.ObjectId, ref: 'Conference', required: true, index: true })
  conference: Types.ObjectId;

  @Prop({ default: 'pending', enum: ['pending', 'under_review', 'accepted', 'rejected'], index: true })
  status: string;

  @Prop()
  reviewerNotes: string;

  @Prop()
  presentationType: string; // Oral, Poster, etc.
}

export const AbstractSchema = SchemaFactory.createForClass(Abstract);
