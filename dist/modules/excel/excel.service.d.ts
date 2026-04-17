export declare class ExcelService {
    readExcel(file: Buffer, headerMap: Record<string, string>): Promise<any[]>;
    generateExcel(data: any[], sheetName: string): Promise<Buffer>;
}
