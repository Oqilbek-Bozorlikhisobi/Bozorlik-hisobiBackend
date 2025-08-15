import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { MarketRepository } from './market.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), UserModule],
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
