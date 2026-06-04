import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { PaystackService } from './paystack.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private paystackService: PaystackService,
  ) { }

  async create(createPaymentDto: any): Promise<PaymentDocument> {
    const createdPayment = new this.paymentModel(createPaymentDto);
    return createdPayment.save();
  }

  async initiatePayment(paymentData: {
    amount: number;
    email: string;
    fullName: string;
    phone: string;
    purpose: string; // e.g., 'MEMBERSHIP_FEE', 'CONFERENCE_REG', 'EXAM_REGISTRATION'
    gateway: 'PAYSTACK' | 'PAYSTACK_VIRTUAL_ACCOUNT';
  }) {
    const tx_ref = `SCPSN-${Date.now()}`;
    const redirect_url = 'https://spsn-backend.onrender.com/payment-callback';

    if (paymentData.gateway === 'PAYSTACK') {
      const payload = {
        email: paymentData.email,
        amount: paymentData.amount,
        reference: tx_ref,
        callback_url: redirect_url,
        metadata: {
          fullName: paymentData.fullName,
          purpose: paymentData.purpose,
        },
      };

      const response = await this.paystackService.initiatePayment(payload);
      if (response.status) {
        await this.create({
          amount: paymentData.amount,
          reference: tx_ref,
          status: 'PENDING',
          paymentMethod: 'PAYSTACK',
          transactionDetails: response.data,
        });
        return response.data.authorization_url;
      }
    } else if (paymentData.gateway === 'PAYSTACK_VIRTUAL_ACCOUNT') {
      // First create/get customer
      const customerRes = await this.paystackService.createCustomer({
        email: paymentData.email,
        first_name: paymentData.fullName.split(' ')[0],
        last_name: paymentData.fullName.split(' ')[1] || '',
        phone: paymentData.phone
      });

      if (customerRes.status) {
        const dvaRes = await this.paystackService.createDedicatedAccount(customerRes.data.customer_code);
        if (dvaRes.status) {
          await this.create({
            amount: paymentData.amount,
            reference: `DVA-${Date.now()}`,
            status: 'PENDING',
            paymentMethod: 'PAYSTACK_VIRTUAL_ACCOUNT',
            transactionDetails: dvaRes.data,
          });
          return dvaRes.data;
        }
      }
    }

    throw new InternalServerErrorException('Failed to initiate payment');
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel.find().populate('member').sort({ createdAt: -1 }).lean().exec() as any;
  }

  async updateStatus(reference: string, status: string): Promise<PaymentDocument> {
    const updatedPayment = await this.paymentModel
      .findOneAndUpdate({ reference }, { status }, { new: true })
      .exec();
    if (!updatedPayment) throw new NotFoundException('Payment record not found');
    return updatedPayment;
  }

  async bulkUpsert(data: any[]): Promise<any> {
    const ops = data.map(item => ({
      updateOne: {
        filter: { reference: item.reference },
        update: { $set: item },
        upsert: true,
      },
    }));
    return this.paymentModel.bulkWrite(ops);
  }

  async findAllExport(): Promise<any[]> {
    return this.paymentModel.find().populate('member', 'fullName email').lean().exec();
  }

  async approvePayment(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findByIdAndUpdate(
      id,
      { status: 'success' },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async rejectPayment(id: string, reason: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findByIdAndUpdate(
      id,
      { status: 'failed', rejectionReason: reason },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
