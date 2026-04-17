"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const flutterwave_service_1 = require("./flutterwave.service");
const paystack_service_1 = require("./paystack.service");
let PaymentsService = class PaymentsService {
    paymentModel;
    flutterwaveService;
    paystackService;
    constructor(paymentModel, flutterwaveService, paystackService) {
        this.paymentModel = paymentModel;
        this.flutterwaveService = flutterwaveService;
        this.paystackService = paystackService;
    }
    async create(createPaymentDto) {
        const createdPayment = new this.paymentModel(createPaymentDto);
        return createdPayment.save();
    }
    async initiatePayment(paymentData) {
        const tx_ref = `SCPSN-${Date.now()}`;
        const redirect_url = 'http://localhost:3000/payment-callback';
        if (paymentData.gateway === 'FLUTTERWAVE') {
            const payload = {
                tx_ref,
                amount: paymentData.amount,
                currency: 'NGN',
                redirect_url,
                customer: {
                    email: paymentData.email,
                    phonenumber: paymentData.phone,
                    name: paymentData.fullName,
                },
                customizations: {
                    title: 'SCPSN Payments',
                    description: paymentData.purpose,
                    logo: 'https://scpsn.org.ng/logo.png',
                },
            };
            const response = await this.flutterwaveService.initiatePayment(payload);
            if (response.status === 'success') {
                await this.create({
                    amount: paymentData.amount,
                    reference: tx_ref,
                    status: 'PENDING',
                    paymentMethod: 'FLUTTERWAVE',
                    transactionDetails: response.data,
                });
                return response.data.link;
            }
        }
        else if (paymentData.gateway === 'PAYSTACK') {
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
        }
        throw new common_1.InternalServerErrorException('Failed to initiate payment');
    }
    async findAll() {
        return this.paymentModel.find().populate('member').sort({ createdAt: -1 }).lean().exec();
    }
    async updateStatus(reference, status) {
        const updatedPayment = await this.paymentModel
            .findOneAndUpdate({ reference }, { status }, { new: true })
            .exec();
        if (!updatedPayment)
            throw new common_1.NotFoundException('Payment record not found');
        return updatedPayment;
    }
    async bulkUpsert(data) {
        const ops = data.map(item => ({
            updateOne: {
                filter: { reference: item.reference },
                update: { $set: item },
                upsert: true,
            },
        }));
        return this.paymentModel.bulkWrite(ops);
    }
    async findAllExport() {
        return this.paymentModel.find().populate('member', 'fullName email').lean().exec();
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        flutterwave_service_1.FlutterwaveService,
        paystack_service_1.PaystackService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map