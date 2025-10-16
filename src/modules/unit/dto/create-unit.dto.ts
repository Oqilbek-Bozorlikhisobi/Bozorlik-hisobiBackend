import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUnitDto {
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
    description: 'name in uzbek',
    example: 'янги',
  })
  @IsString()
  nameUzk: string;
}
