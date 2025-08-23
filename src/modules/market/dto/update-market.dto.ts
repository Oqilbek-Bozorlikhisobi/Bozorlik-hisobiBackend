import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMarketDto {
  @ApiProperty({
    description: 'Bozorlik qilingan joy manzili',
    example: 'Chorsu',
  })
  @IsString()
  location: string;
}
