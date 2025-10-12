import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QuerySearchDto {
  @ApiPropertyOptional({
    description: 'Title bo‘yicha qidiruv (EN, RU, UZ)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Category id bo'yicha qidirish (uuid)",
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Nechanchi sahifa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Sahifadagi elementlar soni',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
