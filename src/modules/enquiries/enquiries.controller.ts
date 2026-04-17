import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { EnquiriesService } from './enquiries.service';
import { ExcelService } from '../excel/excel.service';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';


@Controller('enquiries')
export class EnquiriesController {
  constructor(
    private readonly enquiriesService: EnquiriesService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Name': '',
      'Email': '',
      'Subject': '',
      'Message': '',
      'Status': 'New',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Enquiries Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="enquiries_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'name': 'name',
      'email': 'email',
      'subject': 'subject',
      'message': 'message',
      'status': 'status',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.enquiriesService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.enquiriesService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Enquiries');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="enquiries.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  create(@Body() createEnquiryDto: any) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @Get()
  @UseGuards(AuthGuard(['jwt', 'firebase-auth']))
  findAll() {
    return this.enquiriesService.findAll();
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(@Param('id') id: string, @Body() updateEnquiryDto: any) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.enquiriesService.delete(id);
  }
}
