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

  async getUserStatistics(userId: string): Promise<{
    totalMarkets: number;
    totalSpent: number;
    monthlyMarkets: number;
    monthlySpent: number;
    compareToPrevMonth: string;
  }> {
    const userJson = JSON.stringify([{ id: userId }]);

    // Jami ma'lumotlar
    const totalCount = await this.historyRepository
      .createQueryBuilder('history')
      .where(`history.users @> :user`, { user: userJson })
      .getCount();

    const totalSpent = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.totalPrice)', 'sum')
      .where(`history.users @> :user`, { user: userJson })
      .getRawOne()
      .then((r) => Number(r.sum ?? 0));

    // Oylik
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const currentMonthHistories = await this.historyRepository
      .createQueryBuilder('h')
      .where(`h.users @> :user`, { user: userJson })
      .andWhere(`h.createdAt >= :startOfMonth`, { startOfMonth })
      .getMany();

    const currentMonthCount = currentMonthHistories.length;
    const currentMonthSpent = currentMonthHistories.reduce(
      (sum, h) => sum + Number(h.totalPrice || 0),
      0,
    );

    // O‘tgan oy
    const startOfPrevMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1,
    );
    const startOfCurrentMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const prevMonthHistories = await this.historyRepository
      .createQueryBuilder('h')
      .where(`h.users @> :user`, { user: userJson })
      .andWhere('h.createdAt >= :start AND h.createdAt < :end', {
        start: startOfPrevMonth,
        end: startOfCurrentMonth,
      })
      .getMany();

    const prevMonthSpent = prevMonthHistories.reduce(
      (sum, h) => sum + Number(h.totalPrice || 0),
      0,
    );

    const percentChange =
      prevMonthSpent === 0
        ? 0
        : ((currentMonthSpent - prevMonthSpent) / prevMonthSpent) * 100;

    const formattedValue =
      percentChange === 0
        ? '0'
        : percentChange > 0
          ? `+${percentChange.toFixed(1)}`
          : percentChange.toFixed(1);

    return {
      totalMarkets: totalCount,
      totalSpent,
      monthlyMarkets: currentMonthCount,
      monthlySpent: currentMonthSpent,
      compareToPrevMonth: formattedValue,
    };
  }
}
