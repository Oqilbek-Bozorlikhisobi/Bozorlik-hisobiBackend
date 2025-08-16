import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategoryRepository } from './interfaces/category.repository';
import { ICategoryService } from './interfaces/category.service';
import { ResData } from '../../common/lib/resData';
import { Category } from './entities/category.entity';
import { CategoryNotFoundException } from './exeptions/category.exeption';
import { QuerySearchDto } from './dto/query-search.dto';
import { FileIsMissinExeption } from '../products/exeptions/products.exeption';
import { FileService } from '../file/file.service';
import * as path from 'node:path';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    private readonly fileService: FileService,
  ) {}

  async create(dto: CreateCategoryDto, file: Express.Multer.File): Promise<ResData<Category>> {
    if (!file) {
      throw new FileIsMissinExeption();
    }
    const fileName = await this.fileService.saveFile(file);
    dto.image = `${process.env.BASE_URL}files/${fileName}`;
    const newCategory = new Category();
    Object.assign(newCategory, dto);
    const data = await this.categoryRepository.create(newCategory);

    return new ResData<Category>('Category created successfully', 201, data);
  }

  async findAll(
    query: QuerySearchDto,
  ): Promise<
    ResData<{ items: Category[]; page: number; limit: number; total: number }>
  > {
    const data = await this.categoryRepository.findAll(query);

    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0, // null bo‘lsa 0
      total: data.total,
    });
  }

  async findOneById(id: string): Promise<ResData<Category>> {
    const foundData = await this.categoryRepository.findById(id);
    if (!foundData) {
      throw new CategoryNotFoundException();
    }

    return new ResData<Category>('ok', 200, foundData);
  }

  async update(id: string, dto: UpdateCategoryDto, file: Express.Multer.File): Promise<ResData<Category>> {
    const foundData = await this.categoryRepository.findById(id);
    if (!foundData) {
      throw new CategoryNotFoundException();
    }
    if (file) {
      const fileName = path.basename(foundData.image)
      await this.fileService.deleteFile(fileName);
      const newFileName = await this.fileService.saveFile(file);
      dto.image = `${process.env.BASE_URL}files/${newFileName}`;
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
    const fileName = path.basename(foundData.image);
    await this.fileService.deleteFile(fileName);
    await this.categoryRepository.delete(foundData);
    return new ResData<Category>(
      'Category deleted successfully',
      200,
      foundData,
    );
  }
}
