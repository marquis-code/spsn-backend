import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  // ================= CATEGORIES =================
  @Get('categories')
  getCategories() {
    return this.newslettersService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() body: any) {
    return this.newslettersService.createCategory(body);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.newslettersService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.newslettersService.deleteCategory(id);
  }

  // ================= CAMPAIGNS =================
  @Get('campaigns')
  getNewsletters() {
    return this.newslettersService.getNewsletters();
  }

  @Get('campaigns/:id')
  getNewsletter(@Param('id') id: string) {
    return this.newslettersService.getNewsletter(id);
  }

  @Post('campaigns')
  createNewsletter(@Body() body: any) {
    return this.newslettersService.createNewsletter(body);
  }

  @Put('campaigns/:id')
  updateNewsletter(@Param('id') id: string, @Body() body: any) {
    return this.newslettersService.updateNewsletter(id, body);
  }

  @Delete('campaigns/:id')
  deleteNewsletter(@Param('id') id: string) {
    return this.newslettersService.deleteNewsletter(id);
  }

  @Post('campaigns/:id/publish')
  publishNewsletter(@Param('id') id: string) {
    return this.newslettersService.publishNewsletter(id);
  }

  // ================= SUBSCRIPTIONS =================
  @Get('subscriptions')
  getSubscriptions() {
    return this.newslettersService.getSubscriptions();
  }

  @Post('subscribe')
  subscribe(@Body() body: { email: string; categoryIds: string[]; fullName?: string }) {
    return this.newslettersService.subscribe(body.email, body.categoryIds, body.fullName);
  }

  @Post('callback')
  paymentCallback(@Body() body: { email: string }) {
    return this.newslettersService.handlePaymentCallback(body.email);
  }
}
