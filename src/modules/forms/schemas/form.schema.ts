import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DynamicFormDocument = DynamicForm & Document;

@Schema({ timestamps: true })
export class DynamicForm {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [Object], required: true })
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea';
    required: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
  }[];

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop()
  createdBy: string;
}

export const DynamicFormSchema = SchemaFactory.createForClass(DynamicForm);

@Schema({ timestamps: true })
export class FormResponse {
  @Prop({ required: true, type: String, index: true })
  formId: string;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;

  @Prop()
  submittedBy: string; // Member email or anonymous ID
}

export const FormResponseSchema = SchemaFactory.createForClass(FormResponse);
