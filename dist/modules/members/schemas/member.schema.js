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
exports.MemberSchema = exports.Member = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Member = class Member {
    fullName;
    email;
    phoneNumber;
    membershipId;
    role;
    status;
    category;
    documents;
    professionalProfile;
    expiryDate;
    isActive;
    organization;
    firebaseUid;
    profileImage;
    password;
};
exports.Member = Member;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Member.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Member.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Member.prototype, "membershipId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'regular', enum: ['regular', 'student', 'fellow', 'admin'], index: true }),
    __metadata("design:type", String)
], Member.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending', enum: ['Pending', 'Active', 'Suspended', 'Expired'], index: true }),
    __metadata("design:type", String)
], Member.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Student', 'Associate', 'Full', 'Fellow'] }),
    __metadata("design:type", String)
], Member.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            passport: String,
            qualification: String,
            license: String,
            cv: String,
            id: String,
            proofOfPayment: String,
            referee: String,
        },
        default: {}
    }),
    __metadata("design:type", Object)
], Member.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            bio: String,
            portfolio: String,
            education: [String],
            experience: [String],
        },
        default: {}
    }),
    __metadata("design:type", Object)
], Member.prototype, "professionalProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Member.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Member.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Member.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Member.prototype, "firebaseUid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Member.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
exports.Member = Member = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Member);
exports.MemberSchema = mongoose_1.SchemaFactory.createForClass(Member);
//# sourceMappingURL=member.schema.js.map