import { Repository } from 'typeorm';
import { IHistoryRepository } from './interfaces/history.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';

export class HistoryRepository implements IHistoryRepository {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(dto: History): Promise<History> {
    return await this.historyRepository.save(dto);
  }

  async findAll(userId: string): Promise<Array<History>> {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where(`history.users @> :user`, {
        user: JSON.stringify([{ id: userId }]),
      })
      .getMany();
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
