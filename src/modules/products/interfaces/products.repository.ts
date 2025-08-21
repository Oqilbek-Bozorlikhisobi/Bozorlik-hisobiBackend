import { QuerySearchDto } from "../dto/query-search.dto";
import { Product } from "../entities/product.entity";

export interface IProductsRepository {
  create(dto: Product): Promise<Product>;
  findAll(query: QuerySearchDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(entity: Product): Promise<Product>;
  delete(entity: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}