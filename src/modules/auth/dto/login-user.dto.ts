import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'phone number',
    required: true,
    type: String,
    example: '+998901234567',
  })
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone number must start with + and contain only digits',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'user password',
    required: true,
    type: String,
    example: 'password123',
  })
  @IsString()
  password: string;
}
