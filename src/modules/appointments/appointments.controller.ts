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
import { AppointmentsService } from './appointments.service';
import { ExcelService } from '../excel/excel.service';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';


@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Member': '',
      'Date': '',
      'Time': '',
      'Purpose': '',
      'Status': 'Pending',
      'Notes': '',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Appointments Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="appointments_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'member': 'member',
      'date': 'date',
      'time': 'time',
      'purpose': 'purpose',
      'status': 'status',
      'notes': 'notes',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.appointmentsService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.appointmentsService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Appointments');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="appointments.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  create(@Body() createAppointmentDto: any) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @UseGuards(AuthGuard(['jwt', 'firebase-auth']))
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(@Param('id') id: string, @Body() updateAppointmentDto: any) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.appointmentsService.delete(id);
  }
}
