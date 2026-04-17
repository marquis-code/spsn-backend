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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const site_config_schema_1 = require("./schemas/site-config.schema");
let CmsService = class CmsService {
    siteConfigModel;
    cacheManager;
    constructor(siteConfigModel, cacheManager) {
        this.siteConfigModel = siteConfigModel;
        this.cacheManager = cacheManager;
    }
    async getConfig() {
        const cached = await this.cacheManager.get('site_config');
        if (cached)
            return cached;
        let config = await this.siteConfigModel.findOne({ configKey: 'main' }).lean().exec();
        if (!config) {
            config = await this.siteConfigModel.create({ configKey: 'main' });
            config = config.toObject();
        }
        await this.cacheManager.set('site_config', config, 1800);
        return config;
    }
    async updateConfig(updateDto) {
        delete updateDto.configKey;
        const updated = await this.siteConfigModel.findOneAndUpdate({ configKey: 'main' }, { $set: updateDto }, { new: true, upsert: true }).lean().exec();
        await this.cacheManager.del('site_config');
        return updated;
    }
    async updateSection(section, data) {
        const updated = await this.siteConfigModel.findOneAndUpdate({ configKey: 'main' }, { $set: { [section]: data } }, { new: true, upsert: true }).lean().exec();
        await this.cacheManager.del('site_config');
        return updated;
    }
    async getChatbotKnowledge() {
        const config = await this.getConfig();
        return config.chatbotKnowledge || [];
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(site_config_schema_1.SiteConfig.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], CmsService);
//# sourceMappingURL=cms.service.js.map