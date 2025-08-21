import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { IProductsRepository } from './interfaces/products.repository';
import { QuerySearchDto } from './dto/query-search.dto';

export class ProductRepository implements IProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: Product): Promise<Product> {
    const data = await this.productRepository.save(dto);
    return data;
  }

  async findAll(query: QuerySearchDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search = '', page = 1, limit = 0, categoryId = '' } = query;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Search qo‘shish (titleEn, titleRu, titleUz)
    if (search) {
      qb.andWhere(
        '(product.titleEn ILIKE :search OR product.titleRu ILIKE :search OR product.titleUz ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Category bo‘yicha filter
    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    // Pagination qo‘llash
    if (limit && limit > 0) {
      qb.skip((page - 1) * limit).take(limit);
    }

    // Natijalarni olish va umumiy sonini hisoblash
    const [data, total] = await qb.getManyAndCount();

    const appliedLimit = limit && limit > 0 ? limit : total;
    const totalPages = appliedLimit > 0 ? Math.ceil(total / appliedLimit) : 1;

    return {
      data,
      total,
      page,
      limit: limit && limit > 0 ? limit : total, // agar limit bo‘lmasa, barcha natijalarni chiqaradi
      totalPages,
    };
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
  }

  async update(entity: Product): Promise<Product> {
    return await this.productRepository.save(entity);
  }

  async delete(entity: Product): Promise<Product> {
    return await this.productRepository.remove(entity);
  }
}
