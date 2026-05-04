import { Controller, Post, Body, Get, UseGuards, Delete, Param } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post('subscribe')
  subscribe(@Body('email') email: string) {
    return this.newslettersService.subscribe(email);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  findAll() {
    return this.newslettersService.findAll();
  }

  @Delete(':email')
  unsubscribe(@Param('email') email: string) {
    return this.newslettersService.unsubscribe(email);
  }
}
