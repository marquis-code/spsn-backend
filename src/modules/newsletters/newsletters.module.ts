import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { Newsletter, NewsletterSchema } from './schemas/newsletter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Newsletter.name, schema: NewsletterSchema }]),
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService],
  exports: [NewslettersService],
})
export class NewslettersModule {}
