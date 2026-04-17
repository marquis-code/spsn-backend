import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import * as XLSX from 'xlsx';

@Injectable()
export class MembersImportService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async importFromExcel(file: Express.Multer.File): Promise<{
    total: number;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    if (!file) throw new BadRequestException('No file uploaded');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rows.length) throw new BadRequestException('Excel file is empty');

    const results = { total: rows.length, imported: 0, skipped: 0, errors: [] as string[] };

    // Normalize column headers (case-insensitive mapping)
    const headerMap: Record<string, string> = {
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

    const bulkOps: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const raw = rows[i];
        const normalized: any = {};

        // Normalize keys from Excel headers
        for (const key of Object.keys(raw)) {
          const mappedKey = headerMap[key.toLowerCase().trim()] || key;
          normalized[mappedKey] = typeof raw[key] === 'string' ? raw[key].trim() : raw[key];
        }

        if (!normalized.fullName || !normalized.email) {
          results.errors.push(`Row ${i + 2}: Missing fullName or email`);
          results.skipped++;
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalized.email)) {
          results.errors.push(`Row ${i + 2}: Invalid email "${normalized.email}"`);
          results.skipped++;
          continue;
        }

        // Validate role
        const validRoles = ['regular', 'student', 'fellow', 'admin'];
        if (normalized.role && !validRoles.includes(normalized.role.toLowerCase())) {
          normalized.role = 'regular';
        } else if (normalized.role) {
          normalized.role = normalized.role.toLowerCase();
        }

        // Validate status
        const validStatuses = ['Pending', 'Active', 'Suspended', 'Expired'];
        if (normalized.status && !validStatuses.includes(normalized.status)) {
          normalized.status = 'Pending';
        }

        // Validate category
        const validCategories = ['Student', 'Associate', 'Full', 'Fellow'];
        if (normalized.category && !validCategories.includes(normalized.category)) {
          delete normalized.category;
        }

        // Handle expiry date
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
      } catch (err) {
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
}
