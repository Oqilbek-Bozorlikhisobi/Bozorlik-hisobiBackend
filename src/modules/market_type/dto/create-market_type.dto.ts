import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMarketTypeDto {
  @ApiProperty({
    description: 'MarketType title in english',
    example: 'Family',
  })
  @IsString()
  titleEn: string;

  @ApiProperty({
    description: 'MarketType title in russian',
    example: 'Семья',
  })
  @IsString()
  titleRu: string;

  @ApiProperty({
    description: 'MarketType title in uzbek',
    example: 'Oila',
  })
  @IsString()
  titleUz: string;

  @ApiProperty({
    description: 'MarketType title in uzbek',
    example: 'Оила',
  })
  @IsString()
  titleUzk: string;
}
