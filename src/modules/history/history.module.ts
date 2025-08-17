import { forwardRef, Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { HistoryRepository } from './history.repository';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    forwardRef(() => MarketModule),
  ],
  controllers: [HistoryController],
  providers: [
    { provide: 'IHistoryService', useClass: HistoryService },
    { provide: 'IHistoryRepository', useClass: HistoryRepository },
  ],
  exports: [
    { provide: 'IHistoryService', useClass: HistoryService },
    { provide: 'IHistoryRepository', useClass: HistoryRepository },
  ],
})
export class HistoryModule {}
