import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { BlogsService } from './blogs.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ExcelService } from '../excel/excel.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Title': '',
      'Content': '',
      'Author': '',
      'Category': '',
      'Status': 'Draft',
      'Image': '',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Blogs Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="blogs_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const headerMap = {
      'title': 'title',
      'content': 'content',
      'author': 'author',
      'category': 'category',
      'status': 'status',
      'image': 'image',
    };
    const data = await this.excelService.readExcel(file.buffer, headerMap);
    return this.blogsService.bulkUpsert(data);
  }

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.blogsService.findAllExport();
    const buffer = await this.excelService.generateExcel(data, 'Blogs');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="blogs.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createBlogDto: any) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.blogsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: any) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
