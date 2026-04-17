import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  membershipId: string;

  @Prop({ default: 'regular', enum: ['regular', 'student', 'fellow', 'admin'], index: true })
  role: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Active', 'Suspended', 'Expired'], index: true })
  status: string;

  @Prop({ enum: ['Student', 'Associate', 'Full', 'Fellow'] })
  category: string;

  @Prop({
    type: {
      passport: String,
      qualification: String,
      license: String,
      cv: String,
      id: String,
      proofOfPayment: String,
      referee: String,
    },
    default: {}
  })
  documents: {
    passport: string;
    qualification: string;
    license: string;
    cv: string;
    id: string;
    proofOfPayment: string;
    referee: string;
  };

  @Prop({
    type: {
      bio: String,
      portfolio: String,
      education: [String],
      experience: [String],
    },
    default: {}
  })
  professionalProfile: {
    bio: string;
    portfolio: string;
    education: string[];
    experience: string[];
  };

  @Prop()
  expiryDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  organization: string;

  @Prop()
  firebaseUid: string;

  @Prop()
  profileImage: string;

  @Prop({ select: false })
  password?: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
