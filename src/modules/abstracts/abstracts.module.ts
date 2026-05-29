import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbstractsService } from './abstracts.service';
import { AbstractsController } from './abstracts.controller';
import { Abstract, AbstractSchema } from './schemas/abstract.schema';
import { ExcelModule } from '../excel/excel.module';
import { AbstractsGateway } from './abstracts.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Abstract.name, schema: AbstractSchema }]),
    ExcelModule,
  ],
  controllers: [AbstractsController],
  providers: [AbstractsService, AbstractsGateway],
  exports: [AbstractsService],
})
export class AbstractsModule {}
