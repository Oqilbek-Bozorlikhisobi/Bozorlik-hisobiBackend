import { ResData } from '../../../common/lib/resData';
import { CreateBunnerDto } from '../dto/create-bunner.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateBunnerDto } from '../dto/update-bunner.dto';
import { Bunner } from '../entities/bunner.entity';

export interface IBunnerService {
  create(
    dto: CreateBunnerDto,
    files: {
      fileEn?: Express.Multer.File;
      fileRu?: Express.Multer.File;
      fileUz?: Express.Multer.File;
      fileUzk?: Express.Multer.File;
    },
  ): Promise<ResData<Bunner>>;
  findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: Bunner[];
      page: number;
      limit: number;
      total: number;
    }>
  >;
  findAllWithOutPagination(): Promise<ResData<Bunner[]>>;
  findOneById(id: string): Promise<ResData<Bunner>>;
  update(
    id: string,
    dto: UpdateBunnerDto,
    files?: {
      fileEn?: Express.Multer.File;
      fileRu?: Express.Multer.File;
      fileUz?: Express.Multer.File;
      fileUzk?: Express.Multer.File;
    },
  ): Promise<ResData<Bunner>>;
  delete(id: string): Promise<ResData<Bunner>>;
}
