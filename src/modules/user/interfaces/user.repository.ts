import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<Array<User>>;
  findOneById(id: string): Promise<User | null>;
  create(entity: User): Promise<User>;
  update(entity: User): Promise<User | null>;
  delete(entity: User): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}
