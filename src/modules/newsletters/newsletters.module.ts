import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { Newsletter, NewsletterSchema } from './schemas/newsletter.schema';
import { NewsletterCategory, NewsletterCategorySchema } from './schemas/newsletter-category.schema';
import { NewsletterSubscription, NewsletterSubscriptionSchema } from './schemas/newsletter-subscription.schema';
import { PaymentsModule } from '../payments/payments.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Newsletter.name, schema: NewsletterSchema },
      { name: NewsletterCategory.name, schema: NewsletterCategorySchema },
      { name: NewsletterSubscription.name, schema: NewsletterSubscriptionSchema }
    ]),
    PaymentsModule,
    MailModule
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService],
  exports: [NewslettersService],
})
export class NewslettersModule {}
