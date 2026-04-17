import type { Response } from 'express';
import { PaymentsService } from './payments.service';
import { ExcelService } from '../excel/excel.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly excelService;
    constructor(paymentsService: PaymentsService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createPaymentDto: any): Promise<import("./schemas/payment.schema").PaymentDocument>;
    initiate(paymentData: any): Promise<any>;
    findAll(): Promise<import("./schemas/payment.schema").PaymentDocument[]>;
    updateStatus(reference: string, status: string): Promise<import("./schemas/payment.schema").PaymentDocument>;
}
