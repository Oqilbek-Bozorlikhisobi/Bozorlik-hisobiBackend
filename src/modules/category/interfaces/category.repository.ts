import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  create(dto: Category): Promise<Category>;
  findAll(): Promise<Array<Category>>;
  update(entity: Category): Promise<Category>;
  delete(entity: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
}
