import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdvertsService } from './adverts.service';

@Controller('adverts')
export class AdvertsController {
  constructor(private readonly advertsService: AdvertsService) {}

  // Public endpoint to get active grouped adverts
  @Get('public')
  getPublicAdverts() {
    return this.advertsService.findActiveGroupedBySection();
  }

  // Track clicks
  @Post(':id/click')
  trackClick(@Param('id') id: string) {
    return this.advertsService.incrementClick(id);
  }

  // Admin endpoints
  @Get()
  getAllAdverts() {
    return this.advertsService.findAll();
  }

  @Get(':id')
  getAdvert(@Param('id') id: string) {
    return this.advertsService.findOne(id);
  }

  @Post()
  createAdvert(@Body() body: any) {
    return this.advertsService.create(body);
  }

  @Put(':id')
  updateAdvert(@Param('id') id: string, @Body() body: any) {
    return this.advertsService.update(id, body);
  }

  @Delete(':id')
  deleteAdvert(@Param('id') id: string) {
    return this.advertsService.delete(id);
  }
}
