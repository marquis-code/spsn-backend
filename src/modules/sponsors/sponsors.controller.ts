import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';

@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  // Public endpoint
  @Get('public')
  getPublicSponsors() {
    return this.sponsorsService.findActive();
  }

  // Admin endpoints
  @Get()
  getAllSponsors() {
    return this.sponsorsService.findAll();
  }

  @Get(':id')
  getSponsor(@Param('id') id: string) {
    return this.sponsorsService.findOne(id);
  }

  @Post()
  createSponsor(@Body() body: any) {
    return this.sponsorsService.create(body);
  }

  @Put(':id')
  updateSponsor(@Param('id') id: string, @Body() body: any) {
    return this.sponsorsService.update(id, body);
  }

  @Delete(':id')
  deleteSponsor(@Param('id') id: string) {
    return this.sponsorsService.delete(id);
  }
}
