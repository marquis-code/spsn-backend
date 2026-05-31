import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcosService } from './excos.service';
import { ExcosController } from './excos.controller';
import { Exco, ExcoSchema } from './schemas/exco.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exco.name, schema: ExcoSchema }]),
    CloudinaryModule,
  ],
  controllers: [ExcosController],
  providers: [ExcosService],
})
export class ExcosModule {}
