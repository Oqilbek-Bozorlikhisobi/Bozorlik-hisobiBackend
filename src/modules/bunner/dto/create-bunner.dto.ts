import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBunnerDto {
  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  fileEn: string;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  fileRu: string;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  fileUz: string;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  fileUzk: string;

  @ApiProperty({
    description: 'Batafsil uchun link',
    example: 'https://google.com',
  })
  @IsString()
  link: string;

  @IsOptional()
  imageEn: string;

  @IsOptional()
  imageRu: string;

  @IsOptional()
  imageUz: string;

  @IsOptional()
  imageUzk: string;
}
