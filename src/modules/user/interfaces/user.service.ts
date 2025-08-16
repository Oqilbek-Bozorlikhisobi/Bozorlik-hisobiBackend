import { ResData } from "../../../common/lib/resData";
import { CreateUserDto } from "../dto/create-user.dto";
import { QuerySearchDto } from "../dto/query-search.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface IUserService {
  findAll(query: QuerySearchDto): Promise<ResData<Array<User>>>;
  findOneById(id: string): Promise<ResData<User>>;
  findByPhoneNumber(phoneNumber: string): Promise<ResData<User>>;
  create(data: CreateUserDto): Promise<ResData<User>>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<ResData<User>>;
  delete(id: string): Promise<ResData<User>>;
}

