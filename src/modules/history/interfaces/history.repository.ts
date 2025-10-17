import { QuerySearchDto } from '../dto/query-search.dto';
import { History } from '../entities/history.entity';

export interface IHistoryRepository {
  create(dto: History): Promise<History>;
  findAll(
    userId: string,
    query: QuerySearchDto,
  ): Promise<{
    data: History[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(entity: History): Promise<History>;
  delete(entity: History): Promise<History>;
  findById(id: string): Promise<History | null>;
}
