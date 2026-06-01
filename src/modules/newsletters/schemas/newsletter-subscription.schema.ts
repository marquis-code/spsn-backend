import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NewsletterCategory } from './newsletter-category.schema';

export type NewsletterSubscriptionDocument = NewsletterSubscription & Document;

@Schema({ timestamps: true })
export class NewsletterSubscription {
  @Prop({ required: true })
  email: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'NewsletterCategory' }], default: [] })
  categories: NewsletterCategory[];

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop()
  paymentReference: string;

  @Prop()
  proofOfPayment: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const NewsletterSubscriptionSchema = SchemaFactory.createForClass(NewsletterSubscription);

// Enforce unique subscription per email (though an email can just update its categories, we don't want duplicates)
NewsletterSubscriptionSchema.index({ email: 1 }, { unique: true });
