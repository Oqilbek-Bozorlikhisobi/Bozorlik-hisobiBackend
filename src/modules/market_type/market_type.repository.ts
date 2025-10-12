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

    // 🔍 Qidiruv shartlari (multi-language title bo‘lsa)
    const where = [
      { titleEn: ILike(`%${search}%`) },
      { titleRu: ILike(`%${search}%`) },
      { titleUz: ILike(`%${search}%`) },
      { titleUzk: ILike(`%${search}%`) },
    ];

    let data: MarketType[];
    let total: number;

    if (limit && limit > 0) {
      [data, total] = await this.marketTypeRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' }, // eng yangi turlar birinchi chiqadi
      });
    } else {
      [data, total] = await this.marketTypeRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
      });
    }

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
      relations: {},
    });
  }

  async update(entity: MarketType): Promise<MarketType> {
    return await this.marketTypeRepository.save(entity);
  }

  async delete(entity: MarketType): Promise<MarketType> {
    return await this.marketTypeRepository.remove(entity);
  }
}
