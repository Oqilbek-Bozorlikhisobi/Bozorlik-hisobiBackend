import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title in english',
    example: 'Juice',
  })
  @IsString()
  titleEn: string;

  @ApiProperty({
    description: 'Product title in russian',
    example: 'Сок',
  })
  @IsString()
  titleRu: string;

  @ApiProperty({
    description: 'Product title in uzbek',
    example: 'sok',
  })
  @IsString()
  titleUz: string;

  @ApiProperty({
    description: 'Product title in uzbek',
    example: 'Сок',
  })
  @IsString()
  titleUzk: string;

  @ApiProperty({
    description: 'Product desc in English',
    example: 'New invitation to product',
  })
  @IsString()
  descriptionEn: string;

  @ApiProperty({
    description: 'Product desc in Russian',
    example: 'Новое приглашение в продукт',
  })
  @IsString()
  descriptionRu: string;

  @ApiProperty({
    description: 'Product desc in Uzbek (Latin)',
    example: 'Marketga yangi taklif',
  })
  @IsString()
  descriptionUz: string;

  @ApiProperty({
    description: 'Product desc in Uzbek (Cyrillic)',
    example: 'Маркетга янги таклиф',
  })
  @IsString()
  descriptionUzk: string;

  @ApiProperty({
    description: 'Category unique id (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  categoryId: string;

  @IsOptional()
  images: string;

  @ApiProperty({
    description: 'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  files?: Express.Multer.File;
}
