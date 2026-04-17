import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AbstractsService } from './abstracts.service';
import { ExcelService } from '../excel/excel.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('abstracts')
export class AbstractsController {
  constructor(
    private readonly abstractsService: AbstractsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Title': '',
      'Author': '',
      'Content': '',
      'Category': '',
      'Conference': '',
      'Email': '',
      'Phone Number': '',
      'Status': 'Pending',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Abstracts Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="abstracts_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'title': 'title',
      'author': 'author',
      'content': 'content',
      'category': 'category',
      'conference': 'conference',
      'email': 'email',
      'phone number': 'phoneNumber',
      'status': 'status',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.abstractsService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.abstractsService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Abstracts');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="abstracts.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  create(@Body() createAbstractDto: any) {
    return this.abstractsService.create(createAbstractDto);
  }

  @Get()
  findAll(@Query('conferenceId') conferenceId?: string) {
    if (conferenceId) {
      return this.abstractsService.findByConference(conferenceId);
    }
    return this.abstractsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbstractDto: any) {
    return this.abstractsService.update(id, updateAbstractDto);
  }
}
