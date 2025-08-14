import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'Region of the user',
  })
  @IsString()
  region: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender of the user',
  })
  @IsString()
  gender: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of the user',
  })
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone number must start with + and contain only digits',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'user confirm password',
    required: true,
    type: String,
    example: 'password123',
  })
  @IsString()
  confirmPassword: string;
}
