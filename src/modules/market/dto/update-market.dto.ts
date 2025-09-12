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
}
