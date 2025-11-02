import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service';
import { IUserRepository } from './interfaces/user.repository';
import { ResData } from '../../common/lib/resData';
import { User } from './entities/user.entity';
import {
  PasswordOrconfirmPassowrdDidntExists,
  PassworsDontMatch,
  SmsNotSendedExeption,
  UserAlreadyExists,
  UserNotFound,
} from './exeptions/user.esxeption';
import { hash } from 'bcrypt';
import { QuerySearchDto } from './dto/query-search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../auth/entities/otp.entity';
import { Repository } from 'typeorm';
import { generateOTP } from '../../common/helpers/generate-otp';
import { AddMinutesToDate } from '../../common/helpers/addMinutes';
import { ChangePhoneNumberDto } from '../auth/dto/change-phone-number.dto';
import { decode, encode } from '../../common/helpers/crypto';
import { SmsService } from '../sms/sms.service';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { OtpDidntSend } from '../auth/exeption/auth.exeption';
import { SendOtpAgainDto } from '../auth/dto/send-otp-again.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { GetFcmTokenDto } from './dto/get-fcm-token.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private readonly smsService: SmsService,
  ) {}

  async create(data: CreateUserDto): Promise<ResData<User>> {
    const candidate = await this.userRepository.findByPhoneNumber(
      data.phoneNumber,
    );
    if (candidate) {
      throw new UserAlreadyExists();
    }

    if (data.password !== data.confirmPassword) {
      throw new PassworsDontMatch();
    }

    const hashedPassword = await hash(data.password, 7);
    const newUser = new User();
    newUser.fullName = data.fullName;
    newUser.region = data.region;
    newUser.gender = data.gender;
    newUser.phoneNumber = data.phoneNumber;
    newUser.hashedPassword = hashedPassword;
    const newData = await this.userRepository.create(newUser);
    return new ResData<User>('User register successfully', 201, newData);
  }

  async findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: User[];
      page: number;
      limit: number;
      total: number;
    }>
  > {
    const data = await this.userRepository.findAll(query);
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0, // null bo‘lsa 0
      total: data.total,
    });
  }

  async findOneById(id: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    return new ResData<User>('Success', 200, foundData);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!foundData) {
      throw new UserNotFound();
    }
    return new ResData<User>('Success', 200, foundData);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    if (updateUserDto.phoneNumber) {
      const condidate = await this.userRepository.findByPhoneNumber(
        updateUserDto.phoneNumber,
      );
      if (condidate && condidate.id !== id) {
        throw new UserAlreadyExists();
      }
      foundData.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      if (!updateUserDto.password || !updateUserDto.confirmPassword) {
        throw new PasswordOrconfirmPassowrdDidntExists();
      }

      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new PassworsDontMatch();
      }

      const hashedPassword = await hash(updateUserDto.password, 7);
      foundData.hashedPassword = hashedPassword;
    }
    Object.assign(foundData, updateUserDto);
    const newData = await this.userRepository.update(foundData);
    return new ResData<User>('Success', 200, newData);
  }

  async changePhoneNumber(
    id: string,
    changePhoneNumberDto: ChangePhoneNumberDto,
  ): Promise<ResData<{ user_id: string; details: string }>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    const checkUser = await this.userRepository.findByPhoneNumber(changePhoneNumberDto.phoneNumber)
    if (checkUser) {
      throw new UserAlreadyExists();
    }
    const OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);
    await this.otpRepository.delete({ phoneNumber: foundData.phoneNumber });
    await this.otpRepository.delete({
      phoneNumber: changePhoneNumberDto.phoneNumber,
    });

    const newOtp = await this.otpRepository.save({
      phoneNumber: changePhoneNumberDto.phoneNumber,
      otp: OTP,
      expirationTime,
    });
    const details = {
      timestamp: now,
      phoneNumber: changePhoneNumberDto.phoneNumber,
      otpId: newOtp.id,
    };

    const encodeData = await encode(JSON.stringify(details));

    try {
      await this.smsService.sendSms(
        changePhoneNumberDto.phoneNumber,
        String(OTP),
        'BOZOR APP ilovasining telefon raqamni almashtirish uchun kod:',
      );
    } catch (error) {
      console.log(error);
      throw new SmsNotSendedExeption();
    }

    return new ResData('OTP sent successfully', 200, {
      user_id: foundData.id,
      details: encodeData,
      otp: OTP,
    });
  }

  async verifyOtpForChangePhoneNumber(
    id: string,
    verifyOtpDto: VerifyOtpDto,
  ): Promise<ResData<User>> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFound();
    }

    const currentDate = new Date();
    const decotedData = await decode(verifyOtpDto.verification_key);
    const details = JSON.parse(decotedData);

    if (details.phoneNumber !== verifyOtpDto.phoneNumber) {
      throw new OtpDidntSend();
    }
    const resultOtp = await this.otpRepository.findOne({
      where: { id: details.otpId },
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
    if (resultOtp.otp !== verifyOtpDto.otp) {
      throw new BadRequestException('OTP is not eligible');
    }

    await this.otpRepository.save({
      ...resultOtp,
      isVerified: true,
    });
    user.phoneNumber = verifyOtpDto.phoneNumber;
    const newData = await this.userRepository.update(user);
    return new ResData<User>('Success', 200, newData);
  }

  async sendOtpAgainForChangePhoneNumber(
    id: string,
    sendOtpAgainDto: SendOtpAgainDto,
  ): Promise<ResData<{user_id:string, details: string; otp: string }>> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFound();
    }
    const OTP = generateOTP();
    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 5);
    await this.otpRepository.delete({
      phoneNumber: sendOtpAgainDto.phoneNumber,
    });

    const newOtp = await this.otpRepository.save({
      otp: OTP,
      phoneNumber: sendOtpAgainDto.phoneNumber,
      expirationTime: expirationTime,
    });
    const details = {
      timestamp: now,
      phoneNumber: sendOtpAgainDto.phoneNumber,
      otpId: newOtp.id,
    }
    const encodeData = await encode(JSON.stringify(details));
    try {
      await this.smsService.sendSms(
        sendOtpAgainDto.phoneNumber,
        String(OTP),
        'BOZOR APP ilovasining telefon raqamni almashtirish uchun kod:',
      );
    } catch (error) {
      console.log(error);
      throw new SmsNotSendedExeption();
    }
    return new ResData('OTP sent successfully', 200, {
      user_id: user.id,
      details: encodeData,
      otp: String(OTP),
    });

  }

  async delete(id: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    const newData = await this.userRepository.delete(foundData);
    return new ResData<User>('Success', 200, newData);
  }

  async getFcmToken (userId:string, dto: GetFcmTokenDto): Promise<ResData<String>> {
    const user = await this.userRepository.findOneById(userId)
    if (!user) {
      throw new UserNotFound()
    }
    user.fcmToken = dto.fcmToken
    await this.userRepository.update(user)
    return new ResData<String>('Success', 200, "ok");
  }
}
