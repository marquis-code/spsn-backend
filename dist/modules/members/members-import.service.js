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
exports.MembersImportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_schema_1 = require("./schemas/member.schema");
const XLSX = __importStar(require("xlsx"));
let MembersImportService = class MembersImportService {
    memberModel;
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    async importFromExcel(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        if (!rows.length)
            throw new common_1.BadRequestException('Excel file is empty');
        const results = { total: rows.length, imported: 0, skipped: 0, errors: [] };
        const headerMap = {
            'full name': 'fullName',
            'fullname': 'fullName',
            'name': 'fullName',
            'email': 'email',
            'email address': 'email',
            'phone': 'phoneNumber',
            'phone number': 'phoneNumber',
            'phonenumber': 'phoneNumber',
            'membership id': 'membershipId',
            'membershipid': 'membershipId',
            'role': 'role',
            'status': 'status',
            'category': 'category',
            'organization': 'organization',
            'expiry date': 'expiryDate',
            'expirydate': 'expiryDate',
        };
        const bulkOps = [];
        for (let i = 0; i < rows.length; i++) {
            try {
                const raw = rows[i];
                const normalized = {};
                for (const key of Object.keys(raw)) {
                    const mappedKey = headerMap[key.toLowerCase().trim()] || key;
                    normalized[mappedKey] = typeof raw[key] === 'string' ? raw[key].trim() : raw[key];
                }
                if (!normalized.fullName || !normalized.email) {
                    results.errors.push(`Row ${i + 2}: Missing fullName or email`);
                    results.skipped++;
                    continue;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(normalized.email)) {
                    results.errors.push(`Row ${i + 2}: Invalid email "${normalized.email}"`);
                    results.skipped++;
                    continue;
                }
                const validRoles = ['regular', 'student', 'fellow', 'admin'];
                if (normalized.role && !validRoles.includes(normalized.role.toLowerCase())) {
                    normalized.role = 'regular';
                }
                else if (normalized.role) {
                    normalized.role = normalized.role.toLowerCase();
                }
                const validStatuses = ['Pending', 'Active', 'Suspended', 'Expired'];
                if (normalized.status && !validStatuses.includes(normalized.status)) {
                    normalized.status = 'Pending';
                }
                const validCategories = ['Student', 'Associate', 'Full', 'Fellow'];
                if (normalized.category && !validCategories.includes(normalized.category)) {
                    delete normalized.category;
                }
                if (normalized.expiryDate) {
                    const parsed = new Date(normalized.expiryDate);
                    normalized.expiryDate = isNaN(parsed.getTime()) ? undefined : parsed;
                }
                bulkOps.push({
                    updateOne: {
                        filter: { email: normalized.email },
                        update: { $set: normalized },
                        upsert: true,
                    },
                });
            }
            catch (err) {
                results.errors.push(`Row ${i + 2}: ${err.message}`);
                results.skipped++;
            }
        }
        if (bulkOps.length > 0) {
            const bulkResult = await this.memberModel.bulkWrite(bulkOps, { ordered: false });
            results.imported = bulkResult.upsertedCount + bulkResult.modifiedCount;
            results.skipped = results.total - results.imported;
        }
        return results;
    }
};
exports.MembersImportService = MembersImportService;
exports.MembersImportService = MembersImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MembersImportService);
//# sourceMappingURL=members-import.service.js.map