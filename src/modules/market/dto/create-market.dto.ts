import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({
    description: 'Bozorlikni nomi',
    example: 'Dachaga borish',
  })
  @IsString()
  name: string;

  @ApiProperty({
      description: 'User unique id (UUID), Bozorlikni yaratgan user idsi',
      example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    userId: string;
}
