import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from '../dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signData: signInDto) {
    return this.authService.signIn(signData.email, signData.password);
  }
  @Post('/verify-google-token')
  signIn_with_google(@Request() req) {
    return this.authService.verify_google_token(req.body.access_token);
  }
}
