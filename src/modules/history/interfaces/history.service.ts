import { ResData } from '../../../common/lib/resData';
import { CreateHistoryDto } from '../dto/create-history.dto';
import { GetHistoryByUserIdDto } from '../dto/get-history-by-user-id.dto';
import { UpdateHistoryDto } from '../dto/update-history.dto';
import { History } from '../entities/history.entity';

export interface IHistoryService {
  create(dto: CreateHistoryDto): Promise<ResData<History>>;
  getAllUserHistoriesById(dto: GetHistoryByUserIdDto): Promise<ResData<Array<History>>>;
  findOneById(id: string): Promise<ResData<History>>;
  delete(id: string): Promise<ResData<History>>;
}
