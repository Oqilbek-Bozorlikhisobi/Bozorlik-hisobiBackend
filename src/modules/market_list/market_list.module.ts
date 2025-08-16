import { Module } from '@nestjs/common';
import { MarketListService } from './market_list.service';
import { MarketListController } from './market_list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketList } from './entities/market_list.entity';
import { MarketModule } from '../market/market.module';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { MarketListRepository } from './market_list.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketList]),
    MarketModule,
    UserModule,
    ProductsModule,
  ],
  controllers: [MarketListController],
  providers: [
    { provide: 'IMarketListService', useClass: MarketListService },
    { provide: 'IMarketListRepository', useClass: MarketListRepository },
  ],
  exports: [
    { provide: 'IMarketListService', useClass: MarketListService },
    { provide: 'IMarketListRepository', useClass: MarketListRepository },
  ],
})
export class MarketListModule {}
