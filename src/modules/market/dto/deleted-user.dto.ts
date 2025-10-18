import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeletedUserDto {
  @ApiProperty({
    description: 'Deleted user id',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsString()
  @IsUUID()
  deletedUserId: string;

  @ApiProperty({
    description: 'market id',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsString()
  @IsUUID()
  marketId: string;
}
