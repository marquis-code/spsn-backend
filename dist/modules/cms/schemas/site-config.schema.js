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
exports.SiteConfigSchema = exports.SiteConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SiteConfig = class SiteConfig {
    configKey;
    heroSlides;
    marqueeItems;
    pillars;
    stats;
    initiatives;
    aboutContent;
    contactInfo;
    socialLinks;
    chatbotKnowledge;
    siteName;
    siteDescription;
    logoUrl;
    predefinedResponses;
    publications;
};
exports.SiteConfig = SiteConfig;
__decorate([
    (0, mongoose_1.Prop)({ default: 'main', unique: true, index: true }),
    __metadata("design:type", String)
], SiteConfig.prototype, "configKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                tag: String,
                title: String,
                desc: String,
                image: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "heroSlides", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                label: String,
                tag: String,
                icon: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "marqueeItems", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                desc: String,
                icon: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "pillars", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                label: String,
                value: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "stats", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                desc: String,
                icon: String,
                to: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "initiatives", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { title: String, description: String, mission: String, vision: String }, default: {} }),
    __metadata("design:type", Object)
], SiteConfig.prototype, "aboutContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { email: String, phone: String, address: String }, default: {} }),
    __metadata("design:type", Object)
], SiteConfig.prototype, "contactInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { facebook: String, twitter: String, linkedin: String, instagram: String }, default: {} }),
    __metadata("design:type", Object)
], SiteConfig.prototype, "socialLinks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "chatbotKnowledge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Society for Cellular Pathology Scientists of Nigeria' }),
    __metadata("design:type", String)
], SiteConfig.prototype, "siteName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], SiteConfig.prototype, "siteDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], SiteConfig.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                category: String,
                label: String,
                text: String,
            }],
        default: [
            { category: 'General', label: 'Membership Info', text: 'Hello! You can join us by clicking the "Join Us" button on our homepage.' },
            { category: 'Technical', label: 'Login Issue', text: 'If you are having trouble logging in, please reset your password using the "Forgot Password" link.' },
            { category: 'Conference', label: 'Upcoming Events', text: 'Our next conference is scheduled for August. Please check the Conference portal for details.' }
        ],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "predefinedResponses", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                description: String,
                fileUrl: String,
                category: String,
                publishDate: Date,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], SiteConfig.prototype, "publications", void 0);
exports.SiteConfig = SiteConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SiteConfig);
exports.SiteConfigSchema = mongoose_1.SchemaFactory.createForClass(SiteConfig);
//# sourceMappingURL=site-config.schema.js.map