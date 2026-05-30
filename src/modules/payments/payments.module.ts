import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaystackService } from './paystack.service';
import { DuesCronService } from './dues-cron.service';
import { MembersModule } from '../members/members.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MembersModule,
    MailModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackService, DuesCronService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
