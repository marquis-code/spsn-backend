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
exports.EnquiriesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const enquiries_service_1 = require("./enquiries.service");
const excel_service_1 = require("../excel/excel.service");
const passport_1 = require("@nestjs/passport");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
let EnquiriesController = class EnquiriesController {
    enquiriesService;
    excelService;
    constructor(enquiriesService, excelService) {
        this.enquiriesService = enquiriesService;
        this.excelService = excelService;
    }
    async getTemplate(res) {
        const data = [{
                'Name': '',
                'Email': '',
                'Subject': '',
                'Message': '',
                'Status': 'New',
            }];
        const buffer = await this.excelService.generateExcel(data, 'Enquiries Template');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="enquiries_template.xlsx"',
        });
        res.send(buffer);
    }
    async import(file) {
        const headerMap = {
            'name': 'name',
            'email': 'email',
            'subject': 'subject',
            'message': 'message',
            'status': 'status',
        };
        const data = await this.excelService.readExcel(file.buffer, headerMap);
        return this.enquiriesService.bulkUpsert(data);
    }
    async export(res) {
        const data = await this.enquiriesService.findAllExport();
        const buffer = await this.excelService.generateExcel(data, 'Enquiries');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="enquiries.xlsx"',
        });
        res.send(buffer);
    }
    create(createEnquiryDto) {
        return this.enquiriesService.create(createEnquiryDto);
    }
    findAll() {
        return this.enquiriesService.findAll();
    }
    findOne(id) {
        return this.enquiriesService.findOne(id);
    }
    update(id, updateEnquiryDto) {
        return this.enquiriesService.update(id, updateEnquiryDto);
    }
    remove(id) {
        return this.enquiriesService.delete(id);
    }
};
exports.EnquiriesController = EnquiriesController;
__decorate([
    (0, common_1.Get)('template'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "import", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "export", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EnquiriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(['jwt', 'firebase-auth'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnquiriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnquiriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EnquiriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnquiriesController.prototype, "remove", null);
exports.EnquiriesController = EnquiriesController = __decorate([
    (0, common_1.Controller)('enquiries'),
    __metadata("design:paramtypes", [enquiries_service_1.EnquiriesService,
        excel_service_1.ExcelService])
], EnquiriesController);
//# sourceMappingURL=enquiries.controller.js.map