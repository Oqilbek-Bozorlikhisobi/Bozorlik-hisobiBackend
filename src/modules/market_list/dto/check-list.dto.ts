import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CalculationType } from '../../../common/enums/enum';

export class CheckListDto {
  @ApiProperty({
    description: 'Maxsulot olingan narxi',
    example: 12500,
  })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Hisoblash turi: all yoki one',
    enum: CalculationType,
    example: CalculationType.ONE,
  })
  @IsEnum(CalculationType, {
    message: 'calculationType faqat all yoki one bo‘lishi kerak',
  })
  calculationType: CalculationType;
}
