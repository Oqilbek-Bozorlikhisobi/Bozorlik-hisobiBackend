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

  async findAll(query: QuerySearchDto): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search = '', region = '', page = 1, limit = 0 } = query;

    const qb = this.userRepository.createQueryBuilder('user');

    // Search bo‘yicha filter
    if (search) {
      qb.andWhere('user.phoneNumber LIKE :search', { search: `%${search}%` });
    }

    // Region bo‘yicha filter
    if (region) {
      qb.andWhere('user.region = :region', { region });
    }

    // Pagination qo‘llash
    if (limit && limit > 0) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit: limit && limit > 0 ? limit : total,
    };
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
