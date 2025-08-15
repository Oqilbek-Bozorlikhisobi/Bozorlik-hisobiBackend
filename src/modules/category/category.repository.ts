import { InjectRepository } from '@nestjs/typeorm';
import { ICategoryRepository } from './interfaces/category.repository';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { QuerySearchDto } from './dto/query-search.dto';

export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: Category): Promise<Category> {
    const newCategory = await this.categoryRepository.save(dto);
    return newCategory;
  }

  async findAll(
    query: QuerySearchDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { search = '', page = 1, limit } = query;

    const where = [
      { titleEn: ILike(`%${search}%`) },
      { titleRu: ILike(`%${search}%`) },
      { titleUz: ILike(`%${search}%`) },
    ];

    let data: Category[];
    let total: number;

    if (limit && limit > 0) {
      [data, total] = await this.categoryRepository.findAndCount({
        where,
        relations: { products: true },
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      [data, total] = await this.categoryRepository.findAndCount({
        where,
        relations: { products: true },
      });
    }

    return {
      data,
      total,
      page,
      limit: limit && limit > 0 ? limit : total, // null o‘rniga total yoki 0
    };
  }

  async findById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: {
        products: true,
      },
    });
  }

  async update(entity: Category): Promise<Category> {
    return await this.categoryRepository.save(entity);
  }

  async delete(entity: Category): Promise<Category> {
    return await this.categoryRepository.remove(entity);
  }
}
