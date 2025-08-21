import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckListDto {
  @ApiProperty({
    description: 'Maxsulot olingan narxi',
    example: 12500,
  })
  @IsNumber()
  price: number;

  // @ApiProperty({
  //   description: 'User unique Id(uuid)',
  //   example: '550e8400-e29b-41d4-a716-446655440000',
  // })
  @IsOptional()
  @IsString()
  userId: string;
}
