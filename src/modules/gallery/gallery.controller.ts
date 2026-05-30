import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Public endpoint
  @Get('public')
  getPublicGallery() {
    return this.galleryService.findActive();
  }

  // Admin endpoints
  @Get()
  getAllGallery() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  getGalleryItem(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Post()
  createGalleryItem(@Body() body: any) {
    return this.galleryService.create(body);
  }

  @Put(':id')
  updateGalleryItem(@Param('id') id: string, @Body() body: any) {
    return this.galleryService.update(id, body);
  }

  @Delete(':id')
  deleteGalleryItem(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }
}
