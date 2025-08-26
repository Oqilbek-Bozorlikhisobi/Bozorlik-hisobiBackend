import { InjectRepository } from '@nestjs/typeorm';
import { IUnitRepository } from './interfaces/unit.reposotory';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { QuerySearchDto } from './dto/query-search.dto';

export class UnitRepository implements IUnitRepository {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  async create(dto: Unit): Promise<Unit> {
    return await this.unitRepository.save(dto);
  }

  async findAll(query: QuerySearchDto): Promise<{
    data: Unit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit } = query;

    let data: Unit[];
    let total: number;

    if (limit && limit > 0) {
      [data, total] = await this.unitRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      data = await this.unitRepository.find();
      total = data.length;
    }

    const appliedLimit = limit && limit > 0 ? limit : total;
    const totalPages = Math.ceil(total / appliedLimit);

    return {
      data,
      total,
      page,
      limit: appliedLimit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Unit | null> {
    return await this.unitRepository.findOneBy({ id });
  }

  async update(entity: Unit): Promise<Unit> {
    return await this.unitRepository.save(entity);
  }

  async delete(entity: Unit): Promise<Unit> {
    return await this.unitRepository.remove(entity);
  }

  async findAllWithOutPagination(): Promise<Unit[]> {
    return await this.unitRepository.find({
      relations: { marketLists: true },
    });
  }
}
