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
exports.ConferenceSchema = exports.Conference = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Conference = class Conference {
    title;
    description;
    startDate;
    endDate;
    location;
    venue;
    bannerImage;
    status;
    pricing;
    registrationOpen;
    abstractSubmissionOpen;
};
exports.Conference = Conference;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Conference.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Conference.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], Conference.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Conference.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Conference.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Conference.prototype, "venue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Conference.prototype, "bannerImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'upcoming', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], index: true }),
    __metadata("design:type", String)
], Conference.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Conference.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Conference.prototype, "registrationOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Conference.prototype, "abstractSubmissionOpen", void 0);
exports.Conference = Conference = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Conference);
exports.ConferenceSchema = mongoose_1.SchemaFactory.createForClass(Conference);
//# sourceMappingURL=conference.schema.js.map