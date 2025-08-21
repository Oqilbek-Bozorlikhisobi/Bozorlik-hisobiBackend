import { ResData } from "../../../common/lib/resData";
import { CreateProductDto } from "../dto/create-product.dto";
import { QuerySearchDto } from "../dto/query-search.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";

export interface IProductsService {
  create(
    dto: CreateProductDto,
    files: Express.Multer.File,
  ): Promise<ResData<Product>>;
  findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: Product[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<Product>>;
  update(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File,
  ): Promise<ResData<Product>>;
  delete(id: string): Promise<ResData<Product>>;
}