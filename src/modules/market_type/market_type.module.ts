import { Module } from '@nestjs/common';
import { MarketTypeService } from './market_type.service';
import { MarketTypeController } from './market_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketType } from './entities/market_type.entity';
import { MarketTypeRepository } from './market_type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MarketType])],
  controllers: [MarketTypeController],
  providers: [
    { provide: 'IMarketTypeService', useClass: MarketTypeService },
    { provide: 'IMarketTypeRepository', useClass: MarketTypeRepository },
  ],
  exports: [
    { provide: 'IMarketTypeService', useClass: MarketTypeService },
    { provide: 'IMarketTypeRepository', useClass: MarketTypeRepository },
  ],
})
export class MarketTypeModule {}
