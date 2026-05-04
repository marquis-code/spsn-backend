import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  member: Types.ObjectId;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'success' | 'failed';

  @Prop()
  channel: string; // card, bank_transfer, etc

  @Prop({ type: Object })
  metadata: any;

  @Prop()
  paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
