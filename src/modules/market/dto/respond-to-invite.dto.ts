import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class RespondToInviteDto {
  @ApiProperty({
    description: 'market id ',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  marketId: string;

  @ApiProperty({
    description: "Qabul qilgan yoki yoqligi haqida ma'lumot",
    example: 'true',
  })
  @IsBoolean()
  accept: boolean;
}
