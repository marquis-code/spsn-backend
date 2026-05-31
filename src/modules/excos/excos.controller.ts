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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcosService } from './excos.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('excos')
export class ExcosController {
  constructor(
    private readonly excosService: ExcosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  async create(
    @Body() createExcoDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      createExcoDto.profilePicture = uploadResult.secure_url;
    }
    return this.excosService.create(createExcoDto);
  }

  @Get()
  findAll() {
    return this.excosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.excosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @Param('id') id: string,
    @Body() updateExcoDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      updateExcoDto.profilePicture = uploadResult.secure_url;
    }
    return this.excosService.update(id, updateExcoDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.excosService.delete(id);
  }
}
