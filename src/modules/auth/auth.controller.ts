import {
  Controller,
  Post,
  Body,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendOtpAgainDto } from './dto/send-otp-again.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { SendOtpAgainForRegisterDto } from './dto/send-otp-again-for-register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  loginAdmin(
    @Body() data: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAdmin(data, res);
  }

  @Post('refresh/admin')
  refreshTokenAdmin(
    @Body() refreshTokendto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenAdmin(
      refreshTokendto.refreshToken,
      res,
    );
  }

  @Post('register/user')
  registerUser(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.registerUser(data, res);
  }

  @Post('login/user')
  loginUser(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.userLogin(data, res);
  }

  @Post('refresh/user')
  refreshTokenUser(
    @Body() refreshTokendto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenUser(refreshTokendto.refreshToken, res);
  }

  @Post('verify/otp')
  verifyOtp(
    @Body() verifyOtp: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(verifyOtp, res);
  }

  @Post('sendotp/again')
  sendOtpAgain(@Body() data: SendOtpAgainDto) {
    return this.authService.sendOtpAgain(data);
  }

  @Post('forgot/password')
  forgotPassword(@Body() data: RestorePasswordDto) {
    return this.authService.forgetPassword(data);
  }

  @Post('sendotp/again/for-register')
  sendOtpAgainForRegister(@Body() data: SendOtpAgainForRegisterDto) {
    return this.authService.sendOtpAgainForRegister(data);
  }


  @Patch('forget/password/verify-otp')
  verifyOtpForForgetPassword(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtpForForgetPassword(data);
  }
}
