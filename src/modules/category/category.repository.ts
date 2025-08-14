import { InjectRepository } from '@nestjs/typeorm';
import { ICategoryRepository } from './interfaces/category.repository';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: Category): Promise<Category> {
    return await this.categoryRepository.save(dto);
  }

  async findAll(): Promise<Array<Category>> {
    return await this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async update(entity: Category): Promise<Category> {
    return await this.categoryRepository.save(entity);
  }

  async delete(entity: Category): Promise<Category> {
    return await this.categoryRepository.remove(entity);
  }
}
