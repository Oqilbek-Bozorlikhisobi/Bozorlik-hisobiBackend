import { forwardRef, Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { MarketRepository } from './market.repository';
import { UserModule } from '../user/user.module';
import { HistoryModule } from '../history/history.module';
import { MarketListModule } from '../market_list/market_list.module';
import { ProductsModule } from '../products/products.module';
import { UnitModule } from '../unit/unit.module';
import { MarketTypeModule } from '../market_type/market_type.module';
import { NotificationModule } from '../notification/notification.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market]),
    UserModule,
    forwardRef(() => HistoryModule),
    forwardRef(() => MarketListModule),
    ProductsModule,
    UnitModule,
    MarketTypeModule,
    NotificationModule,
    FirebaseModule
  ],
  controllers: [MarketController],
  providers: [
    { provide: 'IMarketService', useClass: MarketService },
    { provide: 'IMarketRepository', useClass: MarketRepository },
  ],
  exports: [
    { provide: 'IMarketService', useClass: MarketService },
    { provide: 'IMarketRepository', useClass: MarketRepository },
  ],
})
export class MarketModule {}
