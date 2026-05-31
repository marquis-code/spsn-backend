import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Request
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/schemas/member.schema';

@Controller('admins')
@UseGuards(FirebaseAuthGuard)
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    @InjectModel(Member.name) private readonly memberModel: Model<MemberDocument>
  ) {}

  private async checkSuperAdmin(req: any) {
    if (req.user.email === 'admin@scpsn.org.ng') return; // Allow fallback testing super_admin
    const user = await this.memberModel.findOne({ email: req.user.email }).exec();
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
      throw new UnauthorizedException('Only super admins can perform this action');
    }
  }

  @Post()
  async create(@Body() createAdminDto: any, @Request() req) {
    await this.checkSuperAdmin(req);
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  async findAll(@Request() req) {
    await this.checkSuperAdmin(req);
    return this.adminsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdminDto: any, @Request() req) {
    await this.checkSuperAdmin(req);
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.checkSuperAdmin(req);
    return this.adminsService.delete(id);
  }
}
