import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DigestDocument = Digest & Document;

@Schema({ timestamps: true })
export class Digest {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: true })
  year: number;

  @Prop({ required: true })
  pdfUrl: string;
}

export const DigestSchema = SchemaFactory.createForClass(Digest);
