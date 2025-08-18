import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
