import { QuerySearchDto } from '../dto/query-search.dto';
import { MarketType } from '../entities/market_type.entity';

export interface IMarketTypeRepository {
  create(dto: MarketType): Promise<MarketType>;
  findAll(query: QuerySearchDto): Promise<{
    data: MarketType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(entity: MarketType): Promise<MarketType>;
  delete(entity: MarketType): Promise<MarketType>;
  findById(id: string): Promise<MarketType | null>;
}
