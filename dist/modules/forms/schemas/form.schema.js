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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormResponseSchema = exports.FormResponse = exports.DynamicFormSchema = exports.DynamicForm = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let DynamicForm = class DynamicForm {
    title;
    description;
    fields;
    isActive;
    createdBy;
};
exports.DynamicForm = DynamicForm;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DynamicForm.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DynamicForm.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], required: true }),
    __metadata("design:type", Array)
], DynamicForm.prototype, "fields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], DynamicForm.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DynamicForm.prototype, "createdBy", void 0);
exports.DynamicForm = DynamicForm = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DynamicForm);
exports.DynamicFormSchema = mongoose_1.SchemaFactory.createForClass(DynamicForm);
let FormResponse = class FormResponse {
    formId;
    data;
    submittedBy;
};
exports.FormResponse = FormResponse;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    __metadata("design:type", String)
], FormResponse.prototype, "formId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], FormResponse.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormResponse.prototype, "submittedBy", void 0);
exports.FormResponse = FormResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FormResponse);
exports.FormResponseSchema = mongoose_1.SchemaFactory.createForClass(FormResponse);
//# sourceMappingURL=form.schema.js.map