import { ResData } from '../../../common/lib/resData';
import { CreateHistoryDto } from '../dto/create-history.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateHistoryDto } from '../dto/update-history.dto';
import { History } from '../entities/history.entity';

export interface IHistoryService {
  create(dto: CreateHistoryDto): Promise<ResData<History>>;
  getAllUserHistoriesById(
    userId: string,
    query: QuerySearchDto,
  ): Promise<
    ResData<{
      data: History[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<History>>;
  delete(id: string): Promise<ResData<History>>;
}
