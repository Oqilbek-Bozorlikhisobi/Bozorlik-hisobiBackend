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
    example: 'Сок',
  })
  @IsString()
  titleUz: string;

  @ApiProperty({
    description: 'Category unique id (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @ApiProperty({
    description: 'png, ppt, wbep formatdagi fayl',
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  @IsOptional()
  files?: Express.Multer.File[];
}
