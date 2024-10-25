import { Module } from '@nestjs/common';
import { uploadController } from './upload.controller';
import { uploadService } from './upload.service';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [uploadController],
  providers: [uploadService],
})
export class uploadModule {}
