import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  image: string;

  @ApiProperty({
    description: 'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: Express.Multer.File;
}
