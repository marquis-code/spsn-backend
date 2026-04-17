import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelService } from '../excel/excel.service';
import type { Response } from 'express';
import { FormsService } from './forms.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get(':id/export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Param('id') formId: string, @Res() res: Response) {
    const data = await this.formsService.findAllResponsesExport(formId);
    const buffer = await this.excelService.generateExcel(data, `Responses_${formId}`);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="form_responses_${formId}.xlsx"`,
    });
    res.send(buffer);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createFormDto: any) {
    return this.formsService.createForm(createFormDto);
  }

  @Get()
  findAll() {
    return this.formsService.findAllForms();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findFormById(id);
  }

  @Post(':id/submit')
  submit(@Param('id') formId: string, @Body() submissionData: any) {
    return this.formsService.submitResponse({ formId, data: submissionData });
  }

  @Get(':id/responses')
  @UseGuards(FirebaseAuthGuard)
  getResponses(@Param('id') formId: string) {
    return this.formsService.findResponsesByFormId(formId);
  }
}
