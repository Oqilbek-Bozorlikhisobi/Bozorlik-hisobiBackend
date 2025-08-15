import { Market } from "../entities/market.entity";

export interface IMarketRepository {
  create(dto: Market): Promise<Market>;
  findAll(): Promise<Array<Market>>;
  update(entity: Market): Promise<Market>;
  delete(entity: Market): Promise<Market>;
  findById(id: string): Promise<Market | null>;
}
