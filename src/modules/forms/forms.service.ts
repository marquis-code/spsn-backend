import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DynamicForm, DynamicFormDocument, FormResponse } from './schemas/form.schema';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(DynamicForm.name) private formModel: Model<DynamicFormDocument>,
    @InjectModel(FormResponse.name) private responseModel: Model<FormResponse>,
  ) {}

  async createForm(createFormDto: any): Promise<DynamicFormDocument> {
    const createdForm = new this.formModel(createFormDto);
    return createdForm.save();
  }

  async findAllForms(): Promise<DynamicFormDocument[]> {
    return this.formModel.find().lean().exec() as any;
  }

  async findFormById(id: string): Promise<DynamicFormDocument> {
    const form = await this.formModel.findById(id).lean().exec();
    if (!form) throw new NotFoundException('Form not found');
    return form as any;
  }

  async submitResponse(submitDto: any): Promise<FormResponse> {
    const createdResponse = new this.responseModel(submitDto);
    return createdResponse.save();
  }

  async findResponsesByFormId(formId: string): Promise<FormResponse[]> {
    return this.responseModel.find({ formId }).sort({ createdAt: -1 }).lean().exec() as any;
  }

  async findAllResponsesExport(formId: string): Promise<any[]> {
    const responses = await this.responseModel.find({ formId }).lean().exec();
    // Flatten responses for Excel (using 'data' field from schema)
    return responses.map((r: any) => ({
      id: r._id,
      ...r.data,
      createdAt: r.createdAt,
    }));
  }
}
