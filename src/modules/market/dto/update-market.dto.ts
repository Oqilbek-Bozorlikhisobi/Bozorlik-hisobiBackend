import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMarketDto {
  @ApiProperty({
    description: 'Bozorlik qilingan joy manzili',
    example: 'Chorsu',
  })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'market name',
    example: 'Market',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Market type idsi kiritiladi',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  marketTypeId?: string;
}
