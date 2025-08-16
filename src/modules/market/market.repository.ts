import { InjectRepository } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { IMarketRepository } from './interfaces/market.repository';

export class MarketRepository implements IMarketRepository {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  async create(entity: Market): Promise<Market> {
    return await this.marketRepository.save(entity);
  }

  async findAll(search: string): Promise<Market[]> {
    const whereCondition = search ? { users: { id: search } } : {};
    return await this.marketRepository.find({
      where: whereCondition,
      relations: {
        users: true,
        marketLists: {
          product: true,
          user: true,
        },
      },
    });
  }

  async findById(id: string): Promise<Market | null> {
    return await this.marketRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async update(entity: Market): Promise<Market> {
    return await this.marketRepository.save(entity);
  }

  async delete(entity: Market): Promise<Market> {
    return await this.marketRepository.remove(entity);
  }
}
