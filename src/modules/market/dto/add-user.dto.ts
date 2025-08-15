import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches } from 'class-validator';

export class AddUserDto {
  @ApiProperty({
    description: 'Market unique id (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  marketId: string;

  @ApiProperty({
      example: '+998901234567',
      description: 'Phone number of the user',
    })
    @IsString()
    @Matches(/^\+\d{1,15}$/, {
      message: 'Phone number must start with + and contain only digits',
    })
  phoneNumber:string
}
