import { ResData } from '../../../common/lib/resData';
import { CreateMarketTypeDto } from '../dto/create-market_type.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateMarketTypeDto } from '../dto/update-market_type.dto';
import { MarketType } from '../entities/market_type.entity';

export interface IMarketTypeService {
  create(
    dto: CreateMarketTypeDto,
    file: Express.Multer.File,
  ): Promise<ResData<MarketType>>;
  findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: MarketType[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<MarketType>>;
  update(
    id: string,
    dto: UpdateMarketTypeDto,
    file: Express.Multer.File,
  ): Promise<ResData<MarketType>>;
  delete(id: string): Promise<ResData<MarketType>>;
}
