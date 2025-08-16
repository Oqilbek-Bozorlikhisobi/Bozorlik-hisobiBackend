import { ResData } from '../../../common/lib/resData';
import { CheckListDto } from '../dto/check-list.dto';
import { CreateMarketListDto } from '../dto/create-market_list.dto';
import { UpdateMarketListDto } from '../dto/update-market_list.dto';
import { MarketList } from '../entities/market_list.entity';

export interface IMarketListService {
  create(dto: CreateMarketListDto): Promise<ResData<MarketList>>;
  findAll(): Promise<ResData<MarketList[]>>;
  findOneById(id: string): Promise<ResData<MarketList>>;
  checkMarketListIsBuying(id: string, dto: CheckListDto): Promise<ResData<MarketList>>;
  delete(id: string): Promise<ResData<MarketList>>;
}
