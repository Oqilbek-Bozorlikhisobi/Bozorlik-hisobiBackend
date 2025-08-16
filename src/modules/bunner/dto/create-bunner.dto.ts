import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBunnerDto {
  @ApiProperty({
    description: 'name in english',
    example: 'new',
  })
  @IsString()
  nameEn: string;

  @ApiProperty({
    description: 'name in russian',
    example: 'новый',
  })
  @IsString()
  nameRu: string;

  @ApiProperty({
    description: 'name in uzbek',
    example: 'yangi',
  })
  @IsString()
  nameUz: string;

  @IsOptional()
  imageRu: string;

  @IsOptional()
  imageEn: string;

  @IsOptional()
  imageUz: string;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  fileEn?: Express.Multer.File;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi rus tilida',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  fileRu?: Express.Multer.File;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi uzbek tilida',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  fileUz?: Express.Multer.File;
}
