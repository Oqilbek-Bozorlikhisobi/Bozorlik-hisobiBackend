import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IAdminRepository } from '../admin/interfaces/admin.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Response } from 'express';
import {
  EmailOrPasswordIncorrect,
  InvalidRefreshToken,
  OtpDidntSend,
  PhoneNumberOrPasswordIncorrect,
  RefreshTokenIsMissingExeption,
} from './exeption/auth.exeption';
import { compare, hash } from 'bcrypt';
import { generateTokens } from '../../common/helpers/generate-token';
import { IUserRepository } from '../user/interfaces/user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { generateUserTokens } from '../../common/helpers/generate-user-token';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUserService } from '../user/interfaces/user.service';
import { generateOTP } from '../../common/helpers/generate-otp';
import { AddMinutesToDate } from '../../common/helpers/addMinutes';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { decode, encode } from '../../common/helpers/crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SmsService } from '../sms/sms.service';
import { SendOtpAgainDto } from './dto/send-otp-again.dto';
import {
  SmsNotSendedExeption,
  UserAlreadyExists,
  UserNotFound,
} from '../user/exeptions/user.esxeption';
import { RoleEnum } from '../../common/enums/enum';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { SendOtpAgainForRegisterDto } from './dto/send-otp-again-for-register.dto';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PHONE = '+998907894561';
const DEFAULT_OTP = '7777';
const DEFAULT_PASSWORD = 'qwerty12345';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUserService')
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {}

  async loginAdmin(data: LoginAdminDto, res: Response) {
    const { login, password } = data;
    const admin = await this.adminRepository.findByLogin(login);
    if (!admin) {
      throw new EmailOrPasswordIncorrect();
    }
    const validPassword = await compare(password, admin.hashedPassword);
    if (!validPassword) {
      throw new EmailOrPasswordIncorrect();
    }
    const tokens = await generateTokens(admin, this.jwtService, RoleEnum.ADMIN);
    const hashedRefreshToken = await hash(tokens.refresh_token, 7);
    admin.hashedRefreshToken = hashedRefreshToken;
    admin.isActive = true;
    await this.adminRepository.update(admin);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'Admin logged in successfully',
      id: admin.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refreshTokenAdmin(refresh_token: string, res: Response) {
    if (!refresh_token) {
      throw new RefreshTokenIsMissingExeption();
    }
    const payload = await this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!payload) {
      throw new InvalidRefreshToken();
    }
    const admin = await this.adminRepository.findByLogin(payload.login);
    if (!admin) {
      throw new InvalidRefreshToken();
    }

    const validRefreshToken = await compare(
      refresh_token,
      admin.hashedRefreshToken,
    );
    if (!validRefreshToken) {
      throw new InvalidRefreshToken();
    }

    const tokens = await generateTokens(admin, this.jwtService, RoleEnum.ADMIN);
    const hashedRefreshToken = await hash(tokens.refresh_token, 7);
    admin.hashedRefreshToken = hashedRefreshToken;
    await this.adminRepository.update(admin);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'Token refreshed successfully',
      id: admin.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async registerUser(data: CreateUserDto, res: Response) {
    const condidate = await this.userRepository.findByPhoneNumber(
      data.phoneNumber,
    );
    if (condidate) {
      throw new UserAlreadyExists();
    }
    let OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);
    await this.otpRepository.delete({ phoneNumber: data.phoneNumber });

    if (data.phoneNumber === DEFAULT_PHONE) {
      OTP = DEFAULT_OTP;
    }
    const newOtp = await this.otpRepository.save({
      otp: OTP,
      phoneNumber: data.phoneNumber,
      expirationTime: expirationTime,
    });
    const details = {
      timestamp: now,
      phoneNumber: data.phoneNumber,
      otpId: newOtp.id,
      userData: data,
    };

    const encodeData = await encode(JSON.stringify(details));

    if (data.phoneNumber !== DEFAULT_PHONE) {
      try {
        await this.smsService.sendSms(
          data.phoneNumber,
          String(OTP),
          'MARKET APP ilovasida ro‘yxatdan o‘tish uchun tasdiqlash kodi:',
        );
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Sms not send');
      }
    }

    return {
      details: encodeData,
      otp: OTP,
    };
  }

  async verifyOtp(verifyOtp: VerifyOtpDto, res: Response) {
    const currentDate = new Date();
    const decotedData = await decode(verifyOtp.verification_key);
    const details = JSON.parse(decotedData);

    if (details.phoneNumber !== verifyOtp.phoneNumber) {
      throw new OtpDidntSend();
    }

    // Agar default telefon raqam va OTP bo‘lsa -> tekshiruvdan o‘tkazmasdan o‘tkazamiz
    if (
      verifyOtp.phoneNumber === DEFAULT_PHONE &&
      verifyOtp.otp === DEFAULT_OTP
    ) {
      const userData: CreateUserDto = details.userData;
      const newUser = await this.userService.create(userData);

      if (!newUser || !newUser.data) {
        throw new BadRequestException('User not created');
      }

      const user = newUser.data;
      const tokens = await generateTokens(user, this.jwtService, RoleEnum.USER);
      const hashedRefreshToken = await hash(tokens.refresh_token, 7);
      user.hashedRefreshToken = hashedRefreshToken;
      await this.userRepository.update(user);

      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: Number(process.env.COOKIE_TIME),
        httpOnly: true,
      });

      return {
        message: 'User registered in successfully (default)',
        user: user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    }

    const resultOtp = await this.otpRepository.findOne({
      where: {
        id: details.otpId,
      },
    });

    if (!resultOtp) {
      throw new BadRequestException('There is no such otp');
    }
    if (resultOtp.isVerified) {
      throw new BadRequestException('This OTP has been verified before');
    }
    if (resultOtp.expirationTime < currentDate) {
      throw new BadRequestException('This OTP has expired');
    }
    if (resultOtp.otp !== verifyOtp.otp) {
      throw new BadRequestException('OTP is not eligible');
    }

    await this.otpRepository.save({
      ...resultOtp,
      isVerified: true,
    });

    const userData: CreateUserDto = details.userData;
    const newUser = await this.userService.create(userData);

    if (!newUser || !newUser.data) {
      throw new BadRequestException('User not created');
    }

    const user = newUser.data;

    const tokens = await generateTokens(user, this.jwtService, RoleEnum.USER);
    const hashedRefreshToken = await hash(tokens.refresh_token, 7);
    user.hashedRefreshToken = hashedRefreshToken;
    await this.userRepository.update(user);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'User registered in successfully',
      user: user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async sendOtpAgainForRegister(data: SendOtpAgainForRegisterDto) {
    const decotedData = await decode(data.verification_key);
    const details = JSON.parse(decotedData);

    if (details.phoneNumber !== data.phoneNumber) {
      throw new OtpDidntSend();
    }

    const OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);

    await this.otpRepository.delete({ phoneNumber: data.phoneNumber });

    const newOtp = await this.otpRepository.save({
      otp: OTP,
      phoneNumber: data.phoneNumber,
      expirationTime: expirationTime,
    });

    details.otpId = newOtp.id;
    details.timestamp = now;

    const encodeData = await encode(JSON.stringify(details));

    let smsText = '';
    if (details.userData) {
      smsText = 'MARKET APP ilovasida ro‘yxatdan o‘tish uchun tasdiqlash kodi:';
    } else if (details.newPassword) {
      smsText = 'MARKET APP ilovasining parolini tiklash uchun kod:';
    }

    try {
      await this.smsService.sendSms(data.phoneNumber, String(OTP), smsText);
    } catch (error) {
      console.log(error);
      throw new SmsNotSendedExeption();
    }

    return {
      details: encodeData,
      otp: OTP,
    };
  }

  async sendOtpAgain(data: SendOtpAgainDto) {
    const user = await this.userRepository.findByPhoneNumber(data.phoneNumber);
    if (!user) {
      throw new UserNotFound();
    }
    const OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);
    await this.otpRepository.delete({ phoneNumber: data.phoneNumber });

    const newOtp = await this.otpRepository.save({
      otp: OTP,
      phoneNumber: data.phoneNumber,
      expirationTime: expirationTime,
    });
    const details = {
      timestamp: now,
      phoneNumber: data.phoneNumber,
      otpId: newOtp.id,
    };

    const encodeData = await encode(JSON.stringify(details));

    // send sms to user
    try {
      await this.smsService.sendSms(
        data.phoneNumber,
        String(OTP),
        'MARKET APP ilovasida ro‘yxatdan o‘tish uchun tasdiqlash kodi:',
      );
    } catch (error) {
      console.log(error);

      return {
        message: 'Sms not sent',
      };
    }
    return {
      user_id: user.id,
      details: encodeData,
      otp: OTP,
    };
  }

  async userLogin(data: LoginUserDto, res: Response) {
    const { phoneNumber, password } = data;

    if (phoneNumber === DEFAULT_PHONE && password === DEFAULT_PASSWORD) {
      let user = await this.userRepository.findByPhoneNumber(DEFAULT_PHONE);

      // Agar mavjud bo‘lmasa — yangi foydalanuvchi yaratamiz
      if (!user) {
        const hashedPassword = await hash(DEFAULT_PASSWORD, 7);
        const newUser = await this.userService.create({
          phoneNumber: DEFAULT_PHONE,
          password: DEFAULT_PASSWORD,
          confirmPassword: DEFAULT_PASSWORD,
          fullName: 'Default Test User',
          region: 'Tashkent',
          gender: 'male',
        });

        if (!newUser || !newUser.data) {
          throw new BadRequestException('Default user not created');
        }

        user = newUser.data;
        user.hashedPassword = hashedPassword;
        await this.userRepository.update(user);
      }

      // Token generatsiya qilish
      const tokens = await generateTokens(user, this.jwtService, RoleEnum.USER);
      const hashedRefreshToken = await hash(tokens.refresh_token, 7);
      user.hashedRefreshToken = hashedRefreshToken;
      await this.userRepository.update(user);

      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: Number(process.env.COOKIE_TIME),
        httpOnly: true,
      });

      return {
        message: 'Default user logged in successfully',
        user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    }

    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new PhoneNumberOrPasswordIncorrect();
    }

    const validPassword = await compare(password, user.hashedPassword);
    if (!validPassword) {
      throw new PhoneNumberOrPasswordIncorrect();
    }
    const tokens = await generateTokens(user, this.jwtService, RoleEnum.USER);
    const hashedRefreshToken = await hash(tokens.refresh_token, 7);
    user.hashedRefreshToken = hashedRefreshToken;
    await this.userRepository.update(user);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'User logged in successfully',
      user: user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refreshTokenUser(refresh_token: string, res: Response) {
    if (!refresh_token) {
      throw new RefreshTokenIsMissingExeption();
    }
    const payload = await this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!payload) {
      throw new InvalidRefreshToken();
    }
    const user = await this.userRepository.findByPhoneNumber(payload.username);
    if (!user) {
      throw new InvalidRefreshToken();
    }
    const validRefreshToken = await compare(
      refresh_token,
      user.hashedRefreshToken,
    );

    if (!validRefreshToken) {
      throw new InvalidRefreshToken();
    }

    const tokens = await generateTokens(user, this.jwtService, RoleEnum.USER);
    const hashedRefreshToken = await hash(tokens.refresh_token, 7);
    user.hashedRefreshToken = hashedRefreshToken;
    await this.userRepository.update(user);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'Token refreshed successfully',
      user: user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async forgetPassword(data: RestorePasswordDto) {
    const user = await this.userRepository.findByPhoneNumber(data.phoneNumber);
    if (!user) {
      throw new UserNotFound();
    }
    const OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);
    await this.otpRepository.delete({ phoneNumber: data.phoneNumber });

    const newOtp = await this.otpRepository.save({
      otp: OTP,
      phoneNumber: data.phoneNumber,
      expirationTime: expirationTime,
    });

    const details = {
      timestamp: now,
      phoneNumber: data.phoneNumber,
      otpId: newOtp.id,
      newPassword: data.newPassword,
    };
    const encodeData = await encode(JSON.stringify(details));

    // send sms to user
    try {
      await this.smsService.sendSms(
        data.phoneNumber,
        String(OTP),
        'MARKET APP ilovasining parolini tiklash uchun kod:',
      );
    } catch (error) {
      console.log(error);
      throw new SmsNotSendedExeption();
    }
    return {
      user_id: user.id,
      details: encodeData,
      otp: OTP,
    };
  }

  async verifyOtpForForgetPassword(data: VerifyOtpDto) {
    const currentDate = new Date();
    const decotedData = await decode(data.verification_key);
    const details = JSON.parse(decotedData);

    if (details.phoneNumber !== data.phoneNumber) {
      throw new OtpDidntSend();
    }
    const resultOtp = await this.otpRepository.findOne({
      where: {
        id: details.otpId,
      },
    });
    if (!resultOtp) {
      throw new BadRequestException('There is no such otp');
    }
    if (resultOtp.isVerified) {
      throw new BadRequestException('This OTP has been verified before');
    }
    if (resultOtp.expirationTime < currentDate) {
      throw new BadRequestException('This OTP has expired');
    }
    if (resultOtp.otp !== data.otp) {
      throw new BadRequestException('OTP is not eligible');
    }
    const user = await this.userRepository.findByPhoneNumber(data.phoneNumber);
    if (!user) {
      throw new BadRequestException('No such user exists');
    }
    await this.otpRepository.save({
      ...resultOtp,
      isVerified: true,
    });
    user.hashedPassword = await hash(details.newPassword, 7);
    await this.userRepository.update(user);
    return {
      message: 'Password changed successfully',
    };
  }
}
