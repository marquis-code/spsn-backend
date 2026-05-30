import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SponsorDocument = Sponsor & Document;

@Schema({ timestamps: true })
export class Sponsor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop()
  websiteUrl: string;

  @Prop({ default: 'NONE' })
  tier: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);
