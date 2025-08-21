import { QuerySearchDto } from '../dto/query-search.dto';
import { Bunner } from '../entities/bunner.entity';

export interface IBunnerRepository {
  create(dto: Bunner): Promise<Bunner>;
  findAll(query: QuerySearchDto): Promise<{
    data: Bunner[];
    total: number;
    page: number;
    limit: number;
  }>;
  findAllWithOutPagination(): Promise<Bunner[]>;
  update(entity: Bunner): Promise<Bunner>;
  delete(entity: Bunner): Promise<Bunner>;
  findById(id: string): Promise<Bunner | null>;
}
