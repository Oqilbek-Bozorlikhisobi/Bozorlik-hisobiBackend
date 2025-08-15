import { PartialType } from '@nestjs/swagger';
import { CreateMarketListDto } from './create-market_list.dto';

export class UpdateMarketListDto extends PartialType(CreateMarketListDto) {}
