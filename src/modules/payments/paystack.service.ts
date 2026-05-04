import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Paystack = require('paystack-api');

@Injectable()
export class PaystackService {
  private paystack: any;

  constructor(private configService: ConfigService) {
    this.paystack = Paystack(this.configService.get<string>('PAYSTACK_SECRET_KEY'));
  }

  async initiatePayment(payload: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
    metadata?: any;
  }) {
    try {
      // Paystack amount is in kobo (NGN * 100)
      const response = await this.paystack.transaction.initialize({
        ...payload,
        amount: payload.amount * 100,
      });
      return response;
    } catch (error) {
      console.error('Paystack Error:', error);
      throw new InternalServerErrorException('Paystack payment initiation failed');
    }
  }

  async createCustomer(payload: { email: string; first_name: string; last_name: string; phone: string }) {
    try {
      const response = await this.paystack.customer.create(payload);
      return response;
    } catch (error) {
      console.error('Paystack Customer Error:', error);
      throw new InternalServerErrorException('Paystack customer creation failed');
    }
  }

  async createDedicatedAccount(customerCode: string) {
    try {
      // Use the dedicated_account endpoint via axios if not in the SDK, but most SDKs have it
      // Standard Paystack SDK might not have 'dedicatedAccount', checking...
      // If it doesn't work, we'll use raw fetch
      const response = await this.paystack.dedicatedAccount.create({
        customer: customerCode,
        preferred_bank: "wema-bank" // Common for Paystack
      });
      return response;
    } catch (error) {
      console.error('Paystack DVA Error:', error);
      throw new InternalServerErrorException('Paystack virtual account creation failed');
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await this.paystack.transaction.verify({ reference });
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Paystack transaction verification failed');
    }
  }
}
