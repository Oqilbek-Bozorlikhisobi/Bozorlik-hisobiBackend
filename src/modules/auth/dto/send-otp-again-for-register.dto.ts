import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendOtpAgainForRegisterDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'user phone number',
  })
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone number must start with + and contain only digits',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'hashed verification key',
    description: 'You take verification_key in sugnup details',
  })
  @IsString()
  @IsNotEmpty()
  verification_key: string;
}
