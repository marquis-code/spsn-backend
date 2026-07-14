import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DigestsService } from './digests.service';
import { DigestsController } from './digests.controller';
import { Digest, DigestSchema } from './schemas/digest.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Digest.name, schema: DigestSchema }]),
    CloudinaryModule,
  ],
  controllers: [DigestsController],
  providers: [DigestsService],
  exports: [DigestsService],
})
export class DigestsModule {}
