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
  UploadedFiles,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { MembersService } from './members.service';
import { MembersImportService } from './members-import.service';
import { ExcelService } from '../excel/excel.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly membersImportService: MembersImportService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('export')
  @UseGuards(FirebaseAuthGuard)
  async export(@Res() res: Response) {
    const data = await this.membersService.findAll();
    const buffer = await this.excelService.generateExcel(data, 'Members');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="members.xlsx"',
    });
    res.send(buffer);
  }

  @Get('template')
  @UseGuards(FirebaseAuthGuard)
  async getTemplate(@Res() res: Response) {
    const data = [{
      'Full Name': '',
      'Email': '',
      'Phone Number': '',
      'Membership ID': '',
      'Role': 'regular',
      'Status': 'Pending',
      'Category': 'Full',
      'Organization': '',
      'Expiry Date': '',
    }];
    const buffer = await this.excelService.generateExcel(data, 'Members Template');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="members_template.xlsx"',
    });
    res.send(buffer);
  }

  @Post('register')
  async register(@Body() payload: any) {
    const memberData = {
      ...payload,
      status: 'Pending',
    };

    return this.membersService.registerMember(memberData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  create(@Body() createMemberDto: any) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('board')
  findBoardMembers() {
    return this.membersService.findBoardMembers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() payload: any) {
    return this.membersService.update(req.user._id, payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: any) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.delete(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importMembers(@UploadedFile() file: Express.Multer.File) {
    return this.membersImportService.importFromExcel(file);
  }

}
