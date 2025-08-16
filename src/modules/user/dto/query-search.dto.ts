import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QuerySearchDto {
  @ApiPropertyOptional({
    description: 'Phone number boyicha qidirish',
    example: '+998901478963',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
