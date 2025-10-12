import { ResData } from '../../../common/lib/resData';
import { CreateBunnerDto } from '../dto/create-bunner.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateBunnerDto } from '../dto/update-bunner.dto';
import { Bunner } from '../entities/bunner.entity';

export interface IBunnerService {
  create(
    dto: CreateBunnerDto,
    file: Express.Multer.File,
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
    file?: Express.Multer.File,
  ): Promise<ResData<Bunner>>;
  delete(id: string): Promise<ResData<Bunner>>;
}
