import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersService } from './members.service';
import { MembersImportService } from './members-import.service';
import { MembersController } from './members.controller';
import { Member, MemberSchema } from './schemas/member.schema';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    CloudinaryModule,
  ],
  controllers: [MembersController],
  providers: [MembersService, MembersImportService],
  exports: [MembersService, MongooseModule],
})
export class MembersModule {}

