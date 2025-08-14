import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from '../file/file.service';
import { IProductsRepository } from './interfaces/products.repository';
import { ICategoryRepository } from '../category/interfaces/category.repository';
import { IProductsService } from './interfaces/products.service';
import { ResData } from '../../common/lib/resData';
import { Product } from './entities/product.entity';
import { FileIsMissinExeption, ProductNotFoundExeption } from './exeptions/products.exeption';
import { CategoryNotFoundException } from '../category/exeptions/category.exeption';
import * as path from 'node:path';
import { QuerySearchDto } from './dto/query-search.dto';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @Inject('IProductsRepository')
    private readonly productRepository: IProductsRepository,
    private readonly fileService: FileService,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ResData<Product>> {
    if (!files || files.length === 0) {
      throw new FileIsMissinExeption();
    }
    const checkCategory = await this.categoryRepository.findById(
      dto.categoryId,
    );
    if (!checkCategory) {
      throw new CategoryNotFoundException();
    }
    
    const images = await Promise.all(
      files.map(async (file) => {
        const filename = await this.fileService.saveFile(file);
        return `${process.env.BASE_URL}files/${filename}`;
      }),
    );
    console.log(images);

    const newProduct = new Product();
    Object.assign(newProduct, dto);
    newProduct.images = images;
    newProduct.category = checkCategory;
    const data = await this.productRepository.create(newProduct);
    return new ResData<Product>('Product created successfully', 201, data);
  }

  async findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: Product[];
      page: number;
      limit: number;
      total: number;
    }>
  > {
    const data = await this.productRepository.findAll(query);

    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit,
      total: data.total,
    });
  }

  async findOneById(id: string): Promise<ResData<Product>> {
    const foundData = await this.productRepository.findById(id);
    if (!foundData) {
      throw new ProductNotFoundExeption();
    }
    return new ResData<Product>('ok', 200, foundData);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File[],
  ): Promise<ResData<Product>> {
    const foundData = await this.productRepository.findById(id);
    if (!foundData) {
      throw new ProductNotFoundExeption();
    }
    if (dto.categoryId) {
      const checkCategory = await this.categoryRepository.findById(
        dto.categoryId,
      );
      if (!checkCategory) {
        throw new CategoryNotFoundException();
      }
      foundData.category = checkCategory;
    }
    if (files) {
      foundData.images.forEach((image) => {
        const fileName = path.basename(image);
        this.fileService.deleteFile(fileName);
      });
      const images = await Promise.all(
        files.map(async (file) => {
          const filename = await this.fileService.saveFile(file);
          return `${process.env.BASE_URL}files/${filename}`;
        }),
      );
      foundData.images = images;
    }
    Object.assign(foundData, dto);
    const data = await this.productRepository.update(foundData);
    return new ResData<Product>('Product updated successfully', 200, data);
  }

  async delete(id: string): Promise<ResData<Product>> {
    const foundData = await this.productRepository.findById(id);
    if (!foundData) {
      throw new ProductNotFoundExeption();
    }
    foundData.images.forEach(async (image) => {
      const fileName = path.basename(image);
      await this.fileService.deleteFile(fileName);
    });
    await this.productRepository.delete(foundData);
    return new ResData<Product>('Product deleted successfully', 200, foundData);
  }
}
