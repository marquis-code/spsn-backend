import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteConfigDocument = SiteConfig & Document;

@Schema({ timestamps: true })
export class SiteConfig {
  @Prop({ default: 'main', unique: true, index: true })
  configKey: string;

  // Hero Section Slides
  @Prop({
    type: [{
      tag: String,
      title: String,
      desc: String,
      image: String,
    }],
    default: [],
  })
  heroSlides: {
    tag: string;
    title: string;
    desc: string;
    image: string;
  }[];

  // Marquee Items
  @Prop({
    type: [{
      label: String,
      tag: String,
      icon: String,
    }],
    default: [],
  })
  marqueeItems: {
    label: string;
    tag: string;
    icon: string;
  }[];

  // Core Pillars
  @Prop({
    type: [{
      title: String,
      desc: String,
      icon: String,
    }],
    default: [],
  })
  pillars: {
    title: string;
    desc: string;
    icon: string;
  }[];

  // Stats
  @Prop({
    type: [{
      label: String,
      value: String,
    }],
    default: [],
  })
  stats: {
    label: string;
    value: string;
  }[];

  // Initiatives
  @Prop({
    type: [{
      title: String,
      desc: String,
      icon: String,
      to: String,
    }],
    default: [],
  })
  initiatives: {
    title: string;
    desc: string;
    icon: string;
    to: string;
  }[];

  // About Page Content
  @Prop({ type: { title: String, description: String, mission: String, vision: String }, default: {} })
  aboutContent: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };

  // Contact Info
  @Prop({ type: { email: String, phone: String, address: String }, default: {} })
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };

  // Social Links
  @Prop({ type: { facebook: String, twitter: String, linkedin: String, instagram: String }, default: {} })
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };

  // Chatbot Knowledge Base
  @Prop({ type: [String], default: [] })
  chatbotKnowledge: string[];

  // General Settings
  @Prop({ default: 'Society for Cellular Pathology Scientists of Nigeria' })
  siteName: string;

  @Prop({ default: '' })
  siteDescription: string;

  @Prop({ default: '' })
  logoUrl: string;

  // Predefined Chat Responses
  @Prop({
    type: [{
      category: String,
      label: String,
      text: String,
    }],
    default: [
      { category: 'General', label: 'Membership Info', text: 'Hello! You can join us by clicking the "Join Us" button on our homepage.' },
      { category: 'Technical', label: 'Login Issue', text: 'If you are having trouble logging in, please reset your password using the "Forgot Password" link.' },
      { category: 'Conference', label: 'Upcoming Events', text: 'Our next conference is scheduled for August. Please check the Conference portal for details.' }
    ],
  })
  predefinedResponses: {
    category: string;
    label: string;
    text: string;
  }[];

  // Digital Library / Publications
  @Prop({
    type: [{
      title: String,
      description: String,
      fileUrl: String,
      category: String,
      publishDate: Date,
    }],
    default: [],
  })
  publications: {
    title: string;
    description: string;
    fileUrl: string;
    category: string;
    publishDate: Date;
  }[];
}

export const SiteConfigSchema = SchemaFactory.createForClass(SiteConfig);
