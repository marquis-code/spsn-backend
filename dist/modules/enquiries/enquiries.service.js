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
exports.EnquiriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enquiry_schema_1 = require("./schemas/enquiry.schema");
let EnquiriesService = class EnquiriesService {
    enquiryModel;
    constructor(enquiryModel) {
        this.enquiryModel = enquiryModel;
    }
    async create(createEnquiryDto) {
        const createdEnquiry = new this.enquiryModel(createEnquiryDto);
        return createdEnquiry.save();
    }
    async findAll() {
        return this.enquiryModel.find().sort({ createdAt: -1 }).lean().exec();
    }
    async findOne(id) {
        const enquiry = await this.enquiryModel.findById(id).lean().exec();
        if (!enquiry)
            throw new common_1.NotFoundException('Enquiry not found');
        return enquiry;
    }
    async update(id, updateEnquiryDto) {
        const updatedEnquiry = await this.enquiryModel
            .findByIdAndUpdate(id, updateEnquiryDto, { new: true })
            .exec();
        if (!updatedEnquiry)
            throw new common_1.NotFoundException('Enquiry not found');
        return updatedEnquiry;
    }
    async delete(id) {
        const result = await this.enquiryModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Enquiry not found');
        return result;
    }
    async bulkUpsert(data) {
        const ops = data.map(item => ({
            updateOne: {
                filter: { email: item.email, subject: item.subject },
                update: { $set: item },
                upsert: true,
            },
        }));
        return this.enquiryModel.bulkWrite(ops);
    }
    async findAllExport() {
        return this.enquiryModel.find().lean().exec();
    }
};
exports.EnquiriesService = EnquiriesService;
exports.EnquiriesService = EnquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(enquiry_schema_1.Enquiry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EnquiriesService);
//# sourceMappingURL=enquiries.service.js.map