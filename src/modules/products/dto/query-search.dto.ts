import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class QuerySearchDto {
  @ApiPropertyOptional({
    description: 'Title bo‘yicha qidiruv (EN, RU, UZ)',
    example: 'milk',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Nechanchi sahifa',
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Sahifadagi elementlar soni',
    example: 10,
  })
  @IsOptional()
  limit?: number;
}