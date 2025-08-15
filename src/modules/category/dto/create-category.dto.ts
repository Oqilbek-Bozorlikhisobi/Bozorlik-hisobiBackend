import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
    description: 'description in english',
    example: 'new',
  })
  @IsString()
  descriptionEn: string;

  @ApiProperty({
    description: 'description in russian',
    example: 'новый',
  })
  @IsString()
  descriptionRu: string;

  @ApiProperty({
    description: 'description in uzbek',
    example: 'yangi',
  })
  @IsString()
  descriptionUz: string;
}
