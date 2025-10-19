import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QuerySearchUserDto {
  @ApiPropertyOptional({
    description: 'isRead boyicha search true yoki false bo‘yicha qidiruv',
  })
  @IsOptional()
  @IsString()
  isRead?: string;

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
