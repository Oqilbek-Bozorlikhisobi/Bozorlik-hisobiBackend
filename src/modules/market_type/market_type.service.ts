import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketTypeDto } from './dto/create-market_type.dto';
import { UpdateMarketTypeDto } from './dto/update-market_type.dto';
import { IMarketTypeService } from './interfaces/market_type.service';
import { IMarketTypeRepository } from './interfaces/market_type.repository';
import { ResData } from '../../common/lib/resData';
import { MarketType } from './entities/market_type.entity';
import { QuerySearchDto } from './dto/query-search.dto';
import {
  FileIsMissinExeption,
  MarketTypeNotFoundExeption,
} from './exeptions/market_type.exeption';
import { FileService } from '../file/file.service';
import * as path from 'node:path';

@Injectable()
export class MarketTypeService implements IMarketTypeService {
  constructor(
    @Inject('IMarketTypeRepository')
    private readonly marketTypeRepository: IMarketTypeRepository,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateMarketTypeDto,
    file: Express.Multer.File,
  ): Promise<ResData<MarketType>> {
    if (!file) {
      throw new FileIsMissinExeption();
    }
    const fileName = await this.fileService.saveFile(file);
    dto.image = `${process.env.BASE_URL}files/${fileName}`;

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
    file: Express.Multer.File,
  ): Promise<ResData<MarketType>> {
    const foundData = await this.marketTypeRepository.findById(id);
    if (!foundData) {
      throw new MarketTypeNotFoundExeption();
    }
    if (file) {
      const fileName = path.basename(foundData.image);
      await this.fileService.deleteFile(fileName);
      const newFileName = await this.fileService.saveFile(file);
      dto.image = `${process.env.BASE_URL}files/${newFileName}`;
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
    if (foundData.image) {
      const fileName = path.basename(foundData.image);
      await this.fileService.deleteFile(fileName);
    }
    await this.marketTypeRepository.delete(foundData);
    return new ResData<MarketType>(
      'MarketType deleted successfully',
      200,
      foundData,
    );
  }
}
