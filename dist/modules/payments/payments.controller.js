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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const payments_service_1 = require("./payments.service");
const excel_service_1 = require("../excel/excel.service");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
let PaymentsController = class PaymentsController {
    paymentsService;
    excelService;
    constructor(paymentsService, excelService) {
        this.paymentsService = paymentsService;
        this.excelService = excelService;
    }
    async getTemplate(res) {
        const data = [{
                'Amount': '',
                'Reference': '',
                'Status': 'Successful',
                'Payment Method': 'Bank Transfer',
                'Member': '',
            }];
        const buffer = await this.excelService.generateExcel(data, 'Payments Template');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="payments_template.xlsx"',
        });
        res.send(buffer);
    }
    async import(file) {
        const headerMap = {
            'amount': 'amount',
            'reference': 'reference',
            'status': 'status',
            'payment method': 'paymentMethod',
            'member': 'member',
        };
        const data = await this.excelService.readExcel(file.buffer, headerMap);
        return this.paymentsService.bulkUpsert(data);
    }
    async export(res) {
        const data = await this.paymentsService.findAllExport();
        const buffer = await this.excelService.generateExcel(data, 'Payments');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="payments.xlsx"',
        });
        res.send(buffer);
    }
    create(createPaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }
    initiate(paymentData) {
        return this.paymentsService.initiatePayment(paymentData);
    }
    findAll() {
        return this.paymentsService.findAll();
    }
    updateStatus(reference, status) {
        return this.paymentsService.updateStatus(reference, status);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('template'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "import", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "export", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('initiate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiate", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':reference/status'),
    __param(0, (0, common_1.Param)('reference')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        excel_service_1.ExcelService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map