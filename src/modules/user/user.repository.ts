import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from './interfaces/user.repository';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { QuerySearchDto } from './dto/query-search.dto';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(entity: User): Promise<User> {
    const newUser = await this.userRepository.create(entity);
    return await this.userRepository.save(newUser);
  }

  async findAll(query: QuerySearchDto): Promise<Array<User>> {
    const {search = ''} = query

    return await this.userRepository.find({
        where: {
            phoneNumber: Like(`%${search}%`)
        }
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { phoneNumber },
    });
  }

  async update(entity: User): Promise<User | null> {
    return await this.userRepository.save(entity);
  }

  async delete(entity: User): Promise<User | null> {
    return await this.userRepository.remove(entity);
  }
}
