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
exports.AbstractsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const abstracts_service_1 = require("./abstracts.service");
const excel_service_1 = require("../excel/excel.service");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
let AbstractsController = class AbstractsController {
    abstractsService;
    excelService;
    constructor(abstractsService, excelService) {
        this.abstractsService = abstractsService;
        this.excelService = excelService;
    }
    async getTemplate(res) {
        const data = [{
                'Title': '',
                'Author': '',
                'Content': '',
                'Category': '',
                'Conference': '',
                'Email': '',
                'Phone Number': '',
                'Status': 'Pending',
            }];
        const buffer = await this.excelService.generateExcel(data, 'Abstracts Template');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="abstracts_template.xlsx"',
        });
        res.send(buffer);
    }
    async import(file) {
        const headerMap = {
            'title': 'title',
            'author': 'author',
            'content': 'content',
            'category': 'category',
            'conference': 'conference',
            'email': 'email',
            'phone number': 'phoneNumber',
            'status': 'status',
        };
        const data = await this.excelService.readExcel(file.buffer, headerMap);
        return this.abstractsService.bulkUpsert(data);
    }
    async export(res) {
        const data = await this.abstractsService.findAllExport();
        const buffer = await this.excelService.generateExcel(data, 'Abstracts');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="abstracts.xlsx"',
        });
        res.send(buffer);
    }
    create(createAbstractDto) {
        return this.abstractsService.create(createAbstractDto);
    }
    findAll(conferenceId) {
        if (conferenceId) {
            return this.abstractsService.findByConference(conferenceId);
        }
        return this.abstractsService.findAll();
    }
    update(id, updateAbstractDto) {
        return this.abstractsService.update(id, updateAbstractDto);
    }
};
exports.AbstractsController = AbstractsController;
__decorate([
    (0, common_1.Get)('template'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractsController.prototype, "import", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractsController.prototype, "export", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AbstractsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('conferenceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AbstractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbstractsController.prototype, "update", null);
exports.AbstractsController = AbstractsController = __decorate([
    (0, common_1.Controller)('abstracts'),
    __metadata("design:paramtypes", [abstracts_service_1.AbstractsService,
        excel_service_1.ExcelService])
], AbstractsController);
//# sourceMappingURL=abstracts.controller.js.map