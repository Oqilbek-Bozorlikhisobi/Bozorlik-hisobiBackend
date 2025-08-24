import { QuerySearchDto } from "../dto/query-search.dto";
import { Unit } from "../entities/unit.entity";

export interface IUnitRepository {
  create(dto: Unit): Promise<Unit>;
  findAll(query: QuerySearchDto): Promise<{
    data: Unit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(entity: Unit): Promise<Unit>;
  delete(entity: Unit): Promise<Unit>;
  findById(id: string): Promise<Unit | null>;
}
