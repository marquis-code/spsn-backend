import { Controller, Post, Body, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Post('verify-2fa')
  async verify2FA(@Body() body: VerifyOtpDto) {
    return this.authService.verify2FA(body.email, body.otp);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('proofOfPayment'))
  async register(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.authService.register(body, file);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('password') password: string) {
    return this.authService.resetPassword(token, password);
  }
}
