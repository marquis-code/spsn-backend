import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';
import { ExcelService } from '../excel/excel.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Amount': '',
      'Reference': '',
      'Status': 'Successful',
      'Payment Method': 'Bank Transfer',
      'Member': '',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Payments Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="payments_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'amount': 'amount',
      'reference': 'reference',
      'status': 'status',
      'payment method': 'paymentMethod',
      'member': 'member',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.paymentsService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.paymentsService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Payments');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="payments.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  create(@Body() createPaymentDto: any) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('initiate')
  initiate(@Body() paymentData: any) {
    return this.paymentsService.initiatePayment(paymentData);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Patch(':reference/status')
  updateStatus(
    @Param('reference') reference: string,
    @Body('status') status: string,
  ) {
    return this.paymentsService.updateStatus(reference, status);
  }
}
