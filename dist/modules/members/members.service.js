"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_schema_1 = require("./schemas/member.schema");
const bcrypt = __importStar(require("bcrypt"));
let MembersService = class MembersService {
    memberModel;
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    async create(createMemberDto) {
        if (createMemberDto.password) {
            createMemberDto.password = await bcrypt.hash(createMemberDto.password, 10);
        }
        const createdMember = new this.memberModel(createMemberDto);
        return createdMember.save();
    }
    async registerMember(payload) {
        const { email, ...rest } = payload;
        const existing = await this.findByEmail(email);
        if (existing) {
            if (payload.password) {
                payload.password = await bcrypt.hash(payload.password, 10);
            }
            return this.update(existing._id.toString(), payload);
        }
        return this.create(payload);
    }
    async findAll() {
        return this.memberModel.find().sort({ createdAt: -1 }).lean().exec();
    }
    async findOne(id) {
        const member = await this.memberModel.findById(id).lean().exec();
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    async findByFirebaseUid(firebaseUid) {
        return this.memberModel.findOne({ firebaseUid }).lean().exec();
    }
    async findByEmail(email) {
        return this.memberModel.findOne({ email }).lean().exec();
    }
    async update(id, updateMemberDto) {
        const updateData = { ...updateMemberDto };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        if (updateData.professionalProfile) {
            const existing = await this.memberModel.findById(id).select('professionalProfile').exec();
            if (existing) {
                updateData.professionalProfile = {
                    ...existing.professionalProfile,
                    ...updateData.professionalProfile
                };
            }
        }
        if (updateData.documents) {
            const existing = await this.memberModel.findById(id).select('documents').exec();
            if (existing) {
                updateData.documents = {
                    ...existing.documents,
                    ...updateData.documents
                };
            }
        }
        const updatedMember = await this.memberModel
            .findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .exec();
        if (!updatedMember)
            throw new common_1.NotFoundException('Member not found');
        return updatedMember;
    }
    async delete(id) {
        const result = await this.memberModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Member not found');
        return result;
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MembersService);
//# sourceMappingURL=members.service.js.map