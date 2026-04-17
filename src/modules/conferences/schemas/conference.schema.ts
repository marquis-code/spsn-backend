import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConferenceDocument = Conference & Document;

@Schema({ timestamps: true })
export class Conference {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  location: string;

  @Prop()
  venue: string;

  @Prop()
  bannerImage: string;

  @Prop({ default: 'upcoming', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], index: true })
  status: string;

  @Prop({ type: [Object], default: [] })
  pricing: { label: string; amount: number; description?: string }[];

  @Prop({ default: true })
  registrationOpen: boolean;

  @Prop({ default: true })
  abstractSubmissionOpen: boolean;
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);
