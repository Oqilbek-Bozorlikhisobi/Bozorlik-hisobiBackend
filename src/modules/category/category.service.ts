import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategoryRepository } from './interfaces/category.repository';
import { ICategoryService } from './interfaces/category.service';
import { ResData } from '../../common/lib/resData';
import { Category } from './entities/category.entity';
import { CategoryNotFoundException } from './exeptions/category.exeption';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  
  async create(dto: CreateCategoryDto): Promise<ResData<Category>> {
    const newCategory = new Category();
    Object.assign(newCategory, dto);
    const data = await this.categoryRepository.create(newCategory);

    return new ResData<Category>('Category created successfully', 201, data);
  }

  async findAll(): Promise<ResData<Array<Category>>> {
    const data = await this.categoryRepository.findAll();
    return new ResData<Array<Category>>('ok', 200, data);
  }

  async findOneById(id: string): Promise<ResData<Category>> {
    const foundData = await this.categoryRepository.findById(id);
    if (!foundData) {
      throw new CategoryNotFoundException();
    }

    return new ResData<Category>('ok', 200, foundData);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<ResData<Category>> {
    const foundData = await this.categoryRepository.findById(id);
    if (!foundData) {
      throw new CategoryNotFoundException();
    }
    Object.assign(foundData, dto);
    const data = await this.categoryRepository.update(foundData);

    return new ResData<Category>('ok', 200, data);
  }

  async delete(id: string): Promise<ResData<Category>> {
    const foundData = await this.categoryRepository.findById(id);
    if (!foundData) {
      throw new CategoryNotFoundException();
    }
    await this.categoryRepository.delete(foundData);
    return new ResData<Category>('Category deleted successfully', 200, foundData);
  }
}
