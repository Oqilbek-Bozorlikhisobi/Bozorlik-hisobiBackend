import { Repository } from 'typeorm';
import { IHistoryRepository } from './interfaces/history.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { QuerySearchDto } from './dto/query-search.dto';

export class HistoryRepository implements IHistoryRepository {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(dto: History): Promise<History> {
    return await this.historyRepository.save(dto);
  }

  async findAll(
    userId: string,
    query: QuerySearchDto,
  ): Promise<{
    data: History[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit, marketTypeId } = query;

    const qb = this.historyRepository
      .createQueryBuilder('history')
      .where(`history.users @> :user`, {
        user: JSON.stringify([{ id: userId }]),
      })
      .orderBy('history.createdAt', 'DESC');

    // Agar marketTypeId bo‘lsa, filtr qo‘shamiz
    if (marketTypeId) {
      qb.andWhere(`history.market_type->>'id' = :marketTypeId`, {
        marketTypeId,
      });
    }

    let data: History[];
    let total: number;

    if (limit) {
      [data, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    } else {
      [data, total] = await qb.getManyAndCount();
    }

    const appliedLimit = limit ?? total;
    const totalPages = limit ? Math.ceil(total / limit) : 1;

    return { data, total, page, limit: appliedLimit, totalPages };
  }

  async findById(id: string): Promise<History | null> {
    return await this.historyRepository.findOne({ where: { id } });
  }

  async update(entity: History): Promise<History> {
    return await this.historyRepository.save(entity);
  }

  async delete(entity: History): Promise<History> {
    return await this.historyRepository.remove(entity);
  }
}
