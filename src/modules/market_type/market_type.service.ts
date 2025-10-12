import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketTypeDto } from './dto/create-market_type.dto';
import { UpdateMarketTypeDto } from './dto/update-market_type.dto';
import { IMarketTypeService } from './interfaces/market_type.service';
import { IMarketTypeRepository } from './interfaces/market_type.repository';
import { ResData } from '../../common/lib/resData';
import { MarketType } from './entities/market_type.entity';
import { QuerySearchDto } from './dto/query-search.dto';
import { MarketTypeNotFoundExeption } from './exeptions/market_type.exeption';

@Injectable()
export class MarketTypeService implements IMarketTypeService {
  constructor(
    @Inject('IMarketTypeRepository')
    private readonly marketTypeRepository: IMarketTypeRepository,
  ) {}

  async create(dto: CreateMarketTypeDto): Promise<ResData<MarketType>> {
    const newMarketType = new MarketType();
    Object.assign(newMarketType, dto);
    const data = await this.marketTypeRepository.create(newMarketType);
    return new ResData<MarketType>(
      'MarketType created successfully',
      201,
      data,
    );
  }

  async findAll(query: QuerySearchDto): Promise<
    ResData<{
      items: MarketType[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  > {
    const data = await this.marketTypeRepository.findAll(query);
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0,
      total: data.total,
      totalPages: data.totalPages,
    });
  }

  async findOneById(id: string): Promise<ResData<MarketType>> {
    const foundData = await this.marketTypeRepository.findById(id);
    if (!foundData) {
      throw new MarketTypeNotFoundExeption();
    }
    return new ResData<MarketType>('ok', 200, foundData);
  }

  async update(
    id: string,
    dto: UpdateMarketTypeDto,
  ): Promise<ResData<MarketType>> {
    const foundData = await this.marketTypeRepository.findById(id);
    if (!foundData) {
      throw new MarketTypeNotFoundExeption();
    }
    Object.assign(foundData, dto);
    const data = await this.marketTypeRepository.update(foundData);
    return new ResData<MarketType>(
      'MarketType updated successfully',
      200,
      data,
    );
  }

  async delete(id: string): Promise<ResData<MarketType>> {
    const foundData = await this.marketTypeRepository.findById(id);
    if (!foundData) {
      throw new MarketTypeNotFoundExeption();
    }
    await this.marketTypeRepository.delete(foundData);
    return new ResData<MarketType>(
      'MarketType deleted successfully',
      200,
      foundData,
    );
  }
}
