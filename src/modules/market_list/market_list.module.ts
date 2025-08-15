import { Module } from '@nestjs/common';
import { MarketListService } from './market_list.service';
import { MarketListController } from './market_list.controller';

@Module({
  controllers: [MarketListController],
  providers: [MarketListService],
})
export class MarketListModule {}
