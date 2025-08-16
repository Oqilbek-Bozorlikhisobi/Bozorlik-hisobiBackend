import { MarketList } from "../entities/market_list.entity";

export interface IMarketListRepository {
  create(dto: MarketList): Promise<MarketList>;
  findAll(): Promise<Promise<MarketList[]>>;
  update(entity: MarketList): Promise<MarketList>;
  delete(entity: MarketList): Promise<MarketList>;
  findById(id: string): Promise<MarketList | null>;
}