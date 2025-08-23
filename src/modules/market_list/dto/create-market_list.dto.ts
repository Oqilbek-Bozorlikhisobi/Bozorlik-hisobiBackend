import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMarketListDto {
  @ApiProperty({
    description: 'Market unique ID(uuid)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  marketId: string;

  @ApiProperty({
    description: 'Product unique ID(uuid)',
    example: '240e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Product name.(Boshqalardi qoshayotgandagi product name)',
    example: 'Sut',
  })
  @IsOptional()
  @IsString()
  productName: string;

  @ApiProperty({
    description: "Product olish miqdori(kg, litr, dona)",
    example: 1
  })
  @IsNumber()
  quantity: number;
}
