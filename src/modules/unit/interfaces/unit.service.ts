import { ResData } from '../../../common/lib/resData';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';

export interface IUnitService {
  create(dto: CreateUnitDto): Promise<ResData<Unit>>;
  findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: Unit[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<Unit>>;
  update(
    id: string,
    dto: UpdateUnitDto,
  ): Promise<ResData<Unit>>;
  delete(id: string): Promise<ResData<Unit>>;
}
