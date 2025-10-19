import { InjectRepository } from '@nestjs/typeorm';
import { ICategoryRepository } from './interfaces/category.repository';
import { Category } from './entities/category.entity';
import { ILike, IsNull, Repository } from 'typeorm';
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

  async findAll(query: QuerySearchDto): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search = '', page = 1, limit, parentId } = query;

    // Qidiruv shartlari
    const where = [
      { titleEn: ILike(`%${search}%`) },
      { titleRu: ILike(`%${search}%`) },
      { titleUz: ILike(`%${search}%`) },
      { titleUzk: ILike(`%${search}%`) },
    ];

    let finalWhere: any[];

    if (parentId && parentId !== 'null' && parentId !== 'undefined') {
      // Faqat ma’lum parentning childlarini olish
      finalWhere = where.map((cond) => ({
        ...cond,
        parent: { id: parentId },
      }));
    } else {
      // Faqat root kategoriyalar (parent = null)
      finalWhere = where.map((cond) => ({
        ...cond,
        parent: IsNull(),
      }));
    }

    let data: Category[];
    let total: number;

    if (limit && limit > 0) {
      [data, total] = await this.categoryRepository.findAndCount({
        where: finalWhere,
        relations: { children: { parent: true }, products: true }, // faqat children yuklanadi
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });
    } else {
      [data, total] = await this.categoryRepository.findAndCount({
        where: finalWhere,
        relations: { children: { parent: true }, products: true },
        order: { createdAt: 'DESC' },
      });
    }

    // ✅ Root kategoriyalardagi parent maydonini olib tashlash
    data = data.map((item) => {
      const { parent, ...rest } = item;
      return rest as Category;
    });

    const appliedLimit = limit && limit > 0 ? limit : total;
    const totalPages = appliedLimit > 0 ? Math.ceil(total / appliedLimit) : 1;

    return {
      data,
      total,
      page,
      limit: appliedLimit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products'],
    });
  }

  async update(entity: Category): Promise<Category> {
    return await this.categoryRepository.save(entity);
  }

  async delete(entity: Category): Promise<Category> {
    return await this.categoryRepository.remove(entity);
  }
}
