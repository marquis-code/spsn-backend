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
import { ConferencesService } from './conferences.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ExcelService } from '../excel/excel.service';

@Controller('conferences')
export class ConferencesController {
  constructor(
    private readonly conferencesService: ConferencesService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Title': '',
      'Description': '',
      'Start Date': '',
      'End Date': '',
      'Location': '',
      'Image': '',
      'Is Active': 'true',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Conferences Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="conferences_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'title': 'title',
      'description': 'description',
      'start date': 'startDate',
      'end date': 'endDate',
      'location': 'location',
      'image': 'image',
      'is active': 'isActive',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.conferencesService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.conferencesService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Conferences');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="conferences.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createConferenceDto: any) {
    return this.conferencesService.create(createConferenceDto);
  }

  @Get()
  findAll() {
    return this.conferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conferencesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(@Param('id') id: string, @Body() updateConferenceDto: any) {
    return this.conferencesService.update(id, updateConferenceDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.conferencesService.delete(id);
  }
}
