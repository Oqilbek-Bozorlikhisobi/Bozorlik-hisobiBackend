import { InjectRepository } from '@nestjs/typeorm';
import { IMarketListRepository } from './interfaces/market-list.repository';
import { Repository } from 'typeorm';
import { MarketList } from './entities/market_list.entity';

export class MarketListRepository implements IMarketListRepository {
  constructor(
    @InjectRepository(MarketList)
    private readonly marketListRepository: Repository<MarketList>,
  ) {}

  async create(dto: MarketList): Promise<MarketList> {
    const data = await this.marketListRepository.save(dto);
    return data;
  }

  async findAll(): Promise<Promise<MarketList[]>> {
    const data = await this.marketListRepository.find({
        relations: {
        market: true,
        product: true,
        user: true,
        unit: true
      },
    })
    return data;
  }

  async findById(id: string): Promise<MarketList | null> {
      return await this.marketListRepository.findOne({
        where: {id},
        relations: {
          market: true,
          product: true,
          user: true,
        }
      })
  }

  async update(entity: MarketList): Promise<MarketList> {
      return await this.marketListRepository.save(entity)
  }

  async delete(entity: MarketList): Promise<MarketList> {
      return await this.marketListRepository.remove(entity)
  }
}
