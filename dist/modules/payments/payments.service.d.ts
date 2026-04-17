import { Model } from 'mongoose';
import { PaymentDocument } from './schemas/payment.schema';
import { FlutterwaveService } from './flutterwave.service';
import { PaystackService } from './paystack.service';
export declare class PaymentsService {
    private paymentModel;
    private flutterwaveService;
    private paystackService;
    constructor(paymentModel: Model<PaymentDocument>, flutterwaveService: FlutterwaveService, paystackService: PaystackService);
    create(createPaymentDto: any): Promise<PaymentDocument>;
    initiatePayment(paymentData: {
        amount: number;
        email: string;
        fullName: string;
        phone: string;
        purpose: string;
        gateway: 'FLUTTERWAVE' | 'PAYSTACK';
    }): Promise<any>;
    findAll(): Promise<PaymentDocument[]>;
    updateStatus(reference: string, status: string): Promise<PaymentDocument>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}
