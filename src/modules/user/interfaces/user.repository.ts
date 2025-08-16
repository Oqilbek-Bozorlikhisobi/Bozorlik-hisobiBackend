import { QuerySearchDto } from '../dto/query-search.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(query: QuerySearchDto): Promise<Array<User>>;
  findOneById(id: string): Promise<User | null>;
  create(entity: User): Promise<User>;
  update(entity: User): Promise<User | null>;
  delete(entity: User): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}
