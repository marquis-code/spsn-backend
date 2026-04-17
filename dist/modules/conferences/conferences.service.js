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
exports.ConferencesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const conference_schema_1 = require("./schemas/conference.schema");
let ConferencesService = class ConferencesService {
    conferenceModel;
    cacheManager;
    constructor(conferenceModel, cacheManager) {
        this.conferenceModel = conferenceModel;
        this.cacheManager = cacheManager;
    }
    async create(createConferenceDto) {
        const createdConference = new this.conferenceModel(createConferenceDto);
        await this.cacheManager.del('all_conferences');
        return createdConference.save();
    }
    async findAll() {
        const cachedData = await this.cacheManager.get('all_conferences');
        if (cachedData)
            return cachedData;
        const conferences = await this.conferenceModel.find().sort({ startDate: 1 }).lean().exec();
        await this.cacheManager.set('all_conferences', conferences, 3600);
        return conferences;
    }
    async findOne(id) {
        const conference = await this.conferenceModel.findById(id).lean().exec();
        if (!conference)
            throw new common_1.NotFoundException('Conference not found');
        return conference;
    }
    async update(id, updateConferenceDto) {
        const updatedConference = await this.conferenceModel
            .findByIdAndUpdate(id, updateConferenceDto, { new: true })
            .exec();
        if (!updatedConference)
            throw new common_1.NotFoundException('Conference not found');
        await this.cacheManager.del('all_conferences');
        return updatedConference;
    }
    async delete(id) {
        const result = await this.conferenceModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Conference not found');
        await this.cacheManager.del('all_conferences');
        return result;
    }
    async bulkUpsert(data) {
        const ops = data.map(item => ({
            updateOne: {
                filter: { title: item.title },
                update: { $set: item },
                upsert: true,
            },
        }));
        await this.cacheManager.del('all_conferences');
        return this.conferenceModel.bulkWrite(ops);
    }
    async findAllExport() {
        return this.conferenceModel.find().lean().exec();
    }
};
exports.ConferencesService = ConferencesService;
exports.ConferencesService = ConferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conference_schema_1.Conference.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], ConferencesService);
//# sourceMappingURL=conferences.service.js.map