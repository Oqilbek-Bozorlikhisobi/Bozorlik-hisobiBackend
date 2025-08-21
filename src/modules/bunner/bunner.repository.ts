import { InjectRepository } from '@nestjs/typeorm';
import { IBunnerRepository } from './interfaces/bunner.repository';
import { Bunner } from './entities/bunner.entity';
import { ILike, Repository } from 'typeorm';
import { QuerySearchDto } from './dto/query-search.dto';

export class BunnerRepository implements IBunnerRepository {
  constructor(
    @InjectRepository(Bunner)
    private readonly bunnerRepository: Repository<Bunner>,
  ) {}

  async create(dto: Bunner): Promise<Bunner> {
    const newBunner = await this.bunnerRepository.save(dto);
    return newBunner;
  }

  async findAll(
    query: QuerySearchDto,
  ): Promise<{ data: Bunner[]; total: number; page: number; limit: number }> {
    const { search = '', page = 1, limit } = query;

    const where = [
      { nameEn: ILike(`%${search}%`) },
      { nameRu: ILike(`%${search}%`) },
      { nameUz: ILike(`%${search}%`) },
    ];

    let data: Bunner[];
    let total: number;

    if (limit && limit > 0) {
      [data, total] = await this.bunnerRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      [data, total] = await this.bunnerRepository.findAndCount({
        where,
      });
    }

    return {
      data,
      total,
      page,
      limit: limit && limit > 0 ? limit : total, // null o‘rniga total yoki 0
    };
  }

  async findAllWithOutPagination(): Promise<Bunner[]> {
    return await this.bunnerRepository.find();
  }

  async findById(id: string): Promise<Bunner | null> {
    return await this.bunnerRepository.findOneBy({ id });
  }

  async update(entity: Bunner): Promise<Bunner> {
    return await this.bunnerRepository.save(entity);
  }

  async delete(entity: Bunner): Promise<Bunner> {
    return await this.bunnerRepository.remove(entity);
  }
}
