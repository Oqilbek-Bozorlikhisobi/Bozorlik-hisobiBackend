import { Market } from "../entities/market.entity";

export interface IMarketRepository {
  create(dto: Market): Promise<Market>;
  findAll(search: string, marketTypeId?: string): Promise<Array<Market>>;
  update(entity: Market): Promise<Market>;
  delete(entity: Market): Promise<Market>;
  findById(id: string): Promise<Market | null>;
  findByIsCurrent(userId: string): Promise<Market | null>;
}
