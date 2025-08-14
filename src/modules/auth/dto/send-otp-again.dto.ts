import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class SendOtpAgainDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'user phone number',
  })
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone number must start with + and contain only digits',
  })
  phoneNumber: string;
}
