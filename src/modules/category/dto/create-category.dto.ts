import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'title in english',
    example: 'new',
  })
  @IsString()
  titleEn: string;

  @ApiProperty({
    description: 'title in russian',
    example: 'новый',
  })
  @IsString()
  titleRu: string;

  @ApiProperty({
    description: 'title in uzbek',
    example: 'yangi',
  })
  @IsString()
  titleUz: string;

  @ApiProperty({
    description: 'title in uzbek',
    example: 'янги',
  })
  @IsString()
  titleUzk: string;

  @ApiProperty({
    description: 'Category id podcategory uchun',
    example: '6709f52b-0bd8-4e1c-bf94-3045d8346970',
    required: false
  })
  @IsOptional()
  @IsUUID()
  parentId: string;

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
