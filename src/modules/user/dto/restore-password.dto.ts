import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty({
    description: 'telofon raqami',
    example: '+998912345678',
  })
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone number must start with + and contain only digits',
  })
  phoneNumber: string;

  @ApiProperty({
    description: "yangi parol",
    example: "qwerty"
  })
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: "yangi parolni tasdiqlash",
    example: "qwerty"
  })
  @IsString()
  confirmNewPassword: string
}
