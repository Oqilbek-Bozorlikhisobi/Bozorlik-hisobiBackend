import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateMarketByHistoryIdDto {
  @ApiProperty({
    example: '23456789oikjuhygfg',
    description: 'History unique id(uuid).',
  })
  @IsString()
  @IsUUID()
  historyId: string;

  @ApiProperty({
    description: 'User unique id (UUID), Bozorlikni yaratgan user idsi',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;
}
