import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class QuerySearchDto {
  @ApiPropertyOptional({
    description: "market type id bo'yicha barchasini olish",
  })
  @IsString()
  marketTypeId: string;

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
