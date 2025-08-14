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
  }> {
    const { search = '', page = 1, limit = 10 } = query;

    const [data, total] = await this.productRepository.findAndCount({
      where: [
        { titleEn: ILike(`%${search}`) },
        { titleRu: ILike(`%${search}`) },
        { titleUz: ILike(`%${search}`) },
      ],
      relations: {
        category: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
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
