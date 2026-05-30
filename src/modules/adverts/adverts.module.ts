import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvertsController } from './adverts.controller';
import { AdvertsService } from './adverts.service';
import { Advert, AdvertSchema } from './schemas/advert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Advert.name, schema: AdvertSchema }]),
  ],
  controllers: [AdvertsController],
  providers: [AdvertsService],
  exports: [AdvertsService],
})
export class AdvertsModule {}
