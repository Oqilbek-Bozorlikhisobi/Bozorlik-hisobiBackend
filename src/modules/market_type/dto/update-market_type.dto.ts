import { PartialType } from '@nestjs/swagger';
import { CreateMarketTypeDto } from './create-market_type.dto';

export class UpdateMarketTypeDto extends PartialType(CreateMarketTypeDto) {}
