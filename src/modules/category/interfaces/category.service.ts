import { ResData } from '../../../common/lib/resData';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

export interface ICategoryService {
  create(
    dto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<ResData<Category>>;
  findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: Category[];
      page: number;
      limit: number;
      total: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<Category>>;
  update(
    id: string,
    dto: UpdateCategoryDto,
    file: Express.Multer.File,
  ): Promise<ResData<Category>>;
  delete(id: string): Promise<ResData<Category>>;
}
