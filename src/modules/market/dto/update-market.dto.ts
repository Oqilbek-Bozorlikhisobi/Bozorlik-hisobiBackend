import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMarketDto } from './create-market.dto';
import { IsString } from 'class-validator';

export class UpdateMarketDto extends PartialType(CreateMarketDto) {
    @ApiProperty({
        description: 'Bozorlik qilingan joy manzili',
        example: 'Chorsu',
      })
      @IsString()
      location: string;
}
