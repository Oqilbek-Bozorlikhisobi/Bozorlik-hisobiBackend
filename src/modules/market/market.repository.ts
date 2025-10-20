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
  
  async findAll(userId: string, marketTypeId?: string): Promise<Market[]> {
    const qb = this.marketRepository
      .createQueryBuilder('market')
      .leftJoinAndSelect('market.users', 'user')
      .leftJoinAndSelect('market.marketLists', 'marketList')
      .leftJoinAndSelect('marketList.product', 'product')
      .leftJoinAndSelect('marketList.user', 'marketListUser')
      .leftJoinAndSelect('marketList.unit', 'unit')
      .leftJoinAndSelect('market.marketType', 'marketType')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('market_user', 'mu')
          .where('mu.market_id = market.id')
          .andWhere('mu.user_id = :userId')
          .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .setParameter('userId', userId)
      .orderBy('marketList.createdAt', 'DESC');

    if (marketTypeId) {
      qb.andWhere('market.marketType.id = :marketTypeId', { marketTypeId });
    }

    return await qb.getMany();
  }

  async findById(id: string): Promise<Market | null> {
    const market = await this.marketRepository.findOne({
      where: { id },
      relations: {
        users: true,
        marketLists: {
          product: true,
          user: true,
          unit: true,
        },
        marketType: true,
      },
      order: {
        marketLists: {
          createdAt: 'DESC',
        },
      },
    });

    if (!market) return null

    if (market.users?.length) {
      market.users.sort((a, b) => {
        if (a.id === market.marketCreator) return -1;
        if (b.id === market.marketCreator) return 1;
        return 0;
      });
    }

    return market;
  }

  async update(entity: Market): Promise<Market> {
    return await this.marketRepository.save(entity);
  }

  async delete(entity: Market): Promise<Market> {
    return await this.marketRepository.remove(entity);
  }

  async findByIsCurrent(userId: string): Promise<Market | null> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .leftJoinAndSelect('market.users', 'user')
      .leftJoinAndSelect('market.marketLists', 'marketList')
      .leftJoinAndSelect('marketList.product', 'product')
      .leftJoinAndSelect('marketList.user', 'marketListUser')
      .leftJoinAndSelect('marketList.unit', 'unit')
      .where('market.isCurrent = :isCurrent', { isCurrent: true })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('market_user', 'mu')
          .where('mu.market_id = market.id')
          .andWhere('mu.user_id = :userId')
          .getQuery();
        return `EXISTS ${subQuery}`;
      })
      .setParameter('userId', userId)
      .orderBy('marketList.createdAt', 'ASC')
      .getOne();
  }
}
