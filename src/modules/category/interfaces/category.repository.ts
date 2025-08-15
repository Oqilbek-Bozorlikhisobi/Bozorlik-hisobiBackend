import { QuerySearchDto } from "../dto/query-search.dto";
import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  create(dto: Category): Promise<Category>;
  findAll(query: QuerySearchDto): Promise<{
      data: Category[];
      total: number;
      page: number;
      limit: number;
    }>;
  update(entity: Category): Promise<Category>;
  delete(entity: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
}
