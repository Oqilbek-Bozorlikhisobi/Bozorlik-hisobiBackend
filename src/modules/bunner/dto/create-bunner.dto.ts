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

  @ApiProperty({
    description: 'name in uzbek kiril',
    example: 'янги',
  })
  @IsString()
  nameUzk: string;

  @ApiProperty({
    description: "Batafsil uchun link",
    example: "https://google.com"
  })
  @IsString()
  link:string

  @IsOptional()
  image: string;

  @ApiProperty({
    description:
      'png, ppt, wbep formatdagi fayl, faqat bitta rasm yuklanadi inglis tilida',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: Express.Multer.File;
}
