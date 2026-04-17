import { Model } from 'mongoose';
import { DynamicFormDocument, FormResponse } from './schemas/form.schema';
export declare class FormsService {
    private formModel;
    private responseModel;
    constructor(formModel: Model<DynamicFormDocument>, responseModel: Model<FormResponse>);
    createForm(createFormDto: any): Promise<DynamicFormDocument>;
    findAllForms(): Promise<DynamicFormDocument[]>;
    findFormById(id: string): Promise<DynamicFormDocument>;
    submitResponse(submitDto: any): Promise<FormResponse>;
    findResponsesByFormId(formId: string): Promise<FormResponse[]>;
    findAllResponsesExport(formId: string): Promise<any[]>;
}
