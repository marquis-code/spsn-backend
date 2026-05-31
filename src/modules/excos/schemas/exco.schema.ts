import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExcoDocument = Exco & Document;

@Schema({ timestamps: true })
export class Exco {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop()
  bio: string;

  @Prop({ required: true })
  profilePicture: string;
}

export const ExcoSchema = SchemaFactory.createForClass(Exco);
