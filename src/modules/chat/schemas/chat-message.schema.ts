import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true, index: true })
  roomId: string;

  @Prop({ required: true, enum: ['user', 'admin', 'ai'] })
  sender: string;

  @Prop()
  senderName: string;

  @Prop()
  senderId: string;

  @Prop()
  senderEmail: string;

  @Prop()
  pageTitle: string;

  @Prop()
  pageUrl: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'sent', enum: ['sent', 'delivered', 'read'] })
  status: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop()
  rating: number;

  @Prop({ default: false })
  isTransferredToAgent: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
