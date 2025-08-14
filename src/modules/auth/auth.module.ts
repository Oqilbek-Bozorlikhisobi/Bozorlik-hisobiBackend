import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    AdminModule,
    UserModule,
    SmsModule,
    JwtModule.register({
      global: true
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
