import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateHistoryDto {
  @ApiProperty({
    example: '23456789oikjuhygfg',
    description:
      'Market unique id(uuid). Historyga otkazmoqchi bolgan market idsi',
  })
  @IsString()
  @IsUUID()
  marketId: string;
}
