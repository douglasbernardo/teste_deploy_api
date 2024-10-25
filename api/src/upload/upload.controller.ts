import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { uploadService } from './upload.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('upload')
export class uploadController {
  constructor(private upload: uploadService) {}

  @UseGuards(AuthGuard)
  @Post('upload-picture')
  uploadPicture(@Request() req) {
    return this.upload.uploadProfilePicture(req.body);
  }
}
