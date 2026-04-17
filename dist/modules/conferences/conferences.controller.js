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
exports.ConferencesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const conferences_service_1 = require("./conferences.service");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const excel_service_1 = require("../excel/excel.service");
let ConferencesController = class ConferencesController {
    conferencesService;
    excelService;
    constructor(conferencesService, excelService) {
        this.conferencesService = conferencesService;
        this.excelService = excelService;
    }
    async getTemplate(res) {
        const data = [{
                'Title': '',
                'Description': '',
                'Start Date': '',
                'End Date': '',
                'Location': '',
                'Image': '',
                'Is Active': 'true',
            }];
        const buffer = await this.excelService.generateExcel(data, 'Conferences Template');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="conferences_template.xlsx"',
        });
        res.send(buffer);
    }
    async import(file) {
        const headerMap = {
            'title': 'title',
            'description': 'description',
            'start date': 'startDate',
            'end date': 'endDate',
            'location': 'location',
            'image': 'image',
            'is active': 'isActive',
        };
        const data = await this.excelService.readExcel(file.buffer, headerMap);
        return this.conferencesService.bulkUpsert(data);
    }
    async export(res) {
        const data = await this.conferencesService.findAllExport();
        const buffer = await this.excelService.generateExcel(data, 'Conferences');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="conferences.xlsx"',
        });
        res.send(buffer);
    }
    create(createConferenceDto) {
        return this.conferencesService.create(createConferenceDto);
    }
    findAll() {
        return this.conferencesService.findAll();
    }
    findOne(id) {
        return this.conferencesService.findOne(id);
    }
    update(id, updateConferenceDto) {
        return this.conferencesService.update(id, updateConferenceDto);
    }
    remove(id) {
        return this.conferencesService.delete(id);
    }
};
exports.ConferencesController = ConferencesController;
__decorate([
    (0, common_1.Get)('template'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConferencesController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConferencesController.prototype, "import", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConferencesController.prototype, "export", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConferencesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConferencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConferencesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConferencesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConferencesController.prototype, "remove", null);
exports.ConferencesController = ConferencesController = __decorate([
    (0, common_1.Controller)('conferences'),
    __metadata("design:paramtypes", [conferences_service_1.ConferencesService,
        excel_service_1.ExcelService])
], ConferencesController);
//# sourceMappingURL=conferences.controller.js.map