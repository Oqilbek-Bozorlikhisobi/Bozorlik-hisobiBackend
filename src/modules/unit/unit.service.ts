import { Inject, Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { IUnitService } from './interfaces/unit.service';
import { IUnitRepository } from './interfaces/unit.reposotory';
import { ResData } from '../../common/lib/resData';
import { Unit } from './entities/unit.entity';
import { QuerySearchDto } from './dto/query-search.dto';
import { UnitNotFoundException } from './exeptions/unit.exeption';

@Injectable()
export class UnitService implements IUnitService {
  constructor(
    @Inject('IUnitRepository')
    private readonly unitRepository: IUnitRepository,
  ) {}

  async create(dto: CreateUnitDto): Promise<ResData<Unit>> {
    const newUnit = new Unit();
    Object.assign(newUnit, dto);
    const data = await this.unitRepository.create(newUnit);
    return new ResData<Unit>('Unit created successfully', 201, data);
  }

  async findAll(
    query: QuerySearchDto,
  ): Promise<
    ResData<{
      items: Unit[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  > {
    const data = await this.unitRepository.findAll(query);
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0, // null bo‘lsa 0
      total: data.total,
      totalPages: data.totalPages,
    });
  }

  async findOneById(id: string): Promise<ResData<Unit>> {
    const foundData = await this.unitRepository.findById(id);
    if (!foundData) {
      throw new UnitNotFoundException();
    }

    return new ResData<Unit>('ok', 200, foundData);
  }

  async update(id: string, dto: UpdateUnitDto): Promise<ResData<Unit>> {
    const foundData = await this.unitRepository.findById(id);
    if (!foundData) {
      throw new UnitNotFoundException();
    }
    Object.assign(foundData, dto);
    const data = await this.unitRepository.update(foundData);
    return new ResData<Unit>('Unit updated successfully', 200, data);
  }

  async delete(id: string): Promise<ResData<Unit>> {
    const foundData = await this.unitRepository.findById(id);
    if (!foundData) {
      throw new UnitNotFoundException();
    }
    const data = await this.unitRepository.delete(foundData);
    return new ResData<Unit>('Unit deleted successfully', 200, data);
  }
}
