import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  /**
   * Reads an Excel file and returns an array of objects
   * @param file Buffer from Multer
   * @param headerMap Record<string, string> to map Excel headers to database fields
   */
  async readExcel(file: Buffer, headerMap: Record<string, string>): Promise<any[]> {
    try {
      const workbook = XLSX.read(file, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rows.length) throw new BadRequestException('Excel file is empty');

      return rows.map((row, index) => {
        const normalized: any = {};
        for (const key of Object.keys(row)) {
          const mappedKey = headerMap[key.toLowerCase().trim()] || key;
          normalized[mappedKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
        }
        normalized.__rowNum = index + 2; // Keep track for error reporting
        return normalized;
      });
    } catch (err) {
      throw new BadRequestException(`Failed to parse Excel: ${err.message}`);
    }
  }

  /**
   * Generates an Excel file buffer from an array of objects
   * @param data Array of objects to export
   * @param sheetName Name of the sheet
   */
  async generateExcel(data: any[], sheetName: string): Promise<Buffer> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer as Buffer;
  }
}
