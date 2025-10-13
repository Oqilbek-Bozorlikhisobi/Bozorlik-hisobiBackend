import { InjectRepository } from '@nestjs/typeorm';
import { IMarketTypeRepository } from './interfaces/market_type.repository';
import { MarketType } from './entities/market_type.entity';
import { ILike, Repository } from 'typeorm';
import { QuerySearchDto } from './dto/query-search.dto';

export class MarketTypeRepository implements IMarketTypeRepository {
  constructor(
    @InjectRepository(MarketType)
    private readonly marketTypeRepository: Repository<MarketType>,
  ) {}

  async create(dto: MarketType): Promise<MarketType> {
    const data = await this.marketTypeRepository.save(dto);
    return data;
  }

  async findAll(query: QuerySearchDto): Promise<{
    data: MarketType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search = '', page = 1, limit } = query;

    const qb = this.marketTypeRepository
      .createQueryBuilder('marketType')
      .leftJoinAndSelect('marketType.markets', 'markets') // ✅ bog‘lanishni ochamiz
      .orderBy('marketType.createdAt', 'DESC');

    if (search) {
      qb.andWhere(
        `(marketType.titleEn ILIKE :search 
        OR marketType.titleRu ILIKE :search 
        OR marketType.titleUz ILIKE :search 
        OR marketType.titleUzk ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (limit && limit > 0) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await qb.getManyAndCount();

    const appliedLimit = limit && limit > 0 ? limit : total;
    const totalPages = appliedLimit > 0 ? Math.ceil(total / appliedLimit) : 1;

    return {
      data,
      total,
      page,
      limit: appliedLimit,
      totalPages,
    };
  }

  async findById(id: string): Promise<MarketType | null> {
    return await this.marketTypeRepository.findOne({
      where: { id },
      relations: { markets: true },
    });
  }

  async update(entity: MarketType): Promise<MarketType> {
    return await this.marketTypeRepository.save(entity);
  }

  async delete(entity: MarketType): Promise<MarketType> {
    return await this.marketTypeRepository.remove(entity);
  }
}
