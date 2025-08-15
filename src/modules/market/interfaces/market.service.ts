import { ResData } from '../../../common/lib/resData';
import { AddUserDto } from '../dto/add-user.dto';
import { CreateMarketDto } from '../dto/create-market.dto';
import { UpdateMarketDto } from '../dto/update-market.dto';
import { Market } from '../entities/market.entity';

export interface IMarketService {
  create(dto: CreateMarketDto): Promise<ResData<Market>>;
  findAll(): Promise<ResData<Array<Market>>>;
  findOneById(id: string): Promise<ResData<Market>>;
  update(id: string, dto: UpdateMarketDto): Promise<ResData<Market>>;
  addUser(addUserDto: AddUserDto): Promise<ResData<Market>>;
  delete(id: string): Promise<ResData<Market>>;
}
