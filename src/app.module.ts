import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import { TranslationInterceptor } from './modules/cms/translation.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './modules/members/members.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ConferencesModule } from './modules/conferences/conferences.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { FormsModule } from './modules/forms/forms.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AbstractsModule } from './modules/abstracts/abstracts.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MailModule } from './modules/mail/mail.module';
import { CmsModule } from './modules/cms/cms.module';
import { ExcelModule } from './modules/excel/excel.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { NewslettersModule } from './modules/newsletters/newsletters.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AdvertsModule } from './modules/adverts/adverts.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { ExcosModule } from './modules/excos/excos.module';
import { AdminsModule } from './modules/admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL') || 60000,
          limit: config.get('THROTTLE_LIMIT') || 10,
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: (configService.get('REDIS_URL') as string) || 'redis://localhost:6379',
          ttl: parseInt(configService.get('REDIS_TTL') as string) || 3600,
        }),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/scpsn',
      }),
      inject: [ConfigService],
    }),
    MembersModule,
    BlogsModule,
    ConferencesModule,
    AppointmentsModule,
    EnquiriesModule,
    FormsModule,
    ChatModule,
    PaymentsModule,
    AbstractsModule,
    AuthModule,
    CloudinaryModule,
    MailModule,
    CmsModule,
    ExcelModule,
    GalleryModule,
    NewslettersModule,
    CampaignsModule,
    AdvertsModule,
    SponsorsModule,
    ExcosModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TranslationInterceptor,
    },
  ],
})
export class AppModule {}
