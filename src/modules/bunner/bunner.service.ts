import { Inject, Injectable } from '@nestjs/common';
import { CreateBunnerDto } from './dto/create-bunner.dto';
import { UpdateBunnerDto } from './dto/update-bunner.dto';
import { IBunnerService } from './interfaces/bunner.service';
import { IBunnerRepository } from './interfaces/bunner.repository';
import { ResData } from '../../common/lib/resData';
import { Bunner } from './entities/bunner.entity';
import { FileIsMissinExeption } from '../products/exeptions/products.exeption';
import { FileService } from '../file/file.service';
import { QuerySearchDto } from './dto/query-search.dto';
import { BunnerNotFoundException } from './exeptions/banner.exeption';
import * as path from 'node:path';

@Injectable()
export class BunnerService implements IBunnerService {
  constructor(
    @Inject('IBunnerRepository')
    private readonly bunnerRepository: IBunnerRepository,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateBunnerDto,
    fileEn: Express.Multer.File,
    fileRu: Express.Multer.File,
    fileUz: Express.Multer.File,
  ): Promise<ResData<Bunner>> {
    if (!fileEn || !fileRu || !fileUz) {
      throw new FileIsMissinExeption();
    }
    const fileNameEn = await this.fileService.saveFile(fileEn);
    const fileNameRu = await this.fileService.saveFile(fileRu);
    const fileNameUz = await this.fileService.saveFile(fileUz);
    dto.imageEn = `${process.env.BASE_URL}files/${fileNameEn}`;
    dto.imageRu = `${process.env.BASE_URL}files/${fileNameRu}`;
    dto.imageUz = `${process.env.BASE_URL}files/${fileNameUz}`;
    const newBunner = new Bunner();
    Object.assign(newBunner, dto);
    const data = await this.bunnerRepository.create(newBunner);
    return new ResData<Bunner>('Bunner created successfully', 201, data);
  }

  async findAll(
    query: QuerySearchDto,
  ): Promise<
    ResData<{ items: Bunner[]; page: number; limit: number; total: number }>
  > {
    const data = await this.bunnerRepository.findAll(query);
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0,
      total: data.total,
    });
  }

  async findOneById(id: string): Promise<ResData<Bunner>> {
    const foundData = await this.bunnerRepository.findById(id);
    if (!foundData) {
      throw new BunnerNotFoundException();
    }

    return new ResData<Bunner>('ok', 200, foundData);
  }

  async findAllWithOutPagination(): Promise<ResData<Bunner[]>> {
    const data = await this.bunnerRepository.findAllWithOutPagination()
    return new ResData<Bunner[]>('ok', 200, data);
  }

  async update(
    id: string,
    dto: UpdateBunnerDto,
    fileEn?: Express.Multer.File,
    fileRu?: Express.Multer.File,
    fileUz?: Express.Multer.File,
  ): Promise<ResData<Bunner>> {
    const foundData = await this.bunnerRepository.findById(id);
    if (!foundData) {
      throw new BunnerNotFoundException();
    }
    if (fileEn) {
      const fileName = path.basename(foundData.imageEn);
      await this.fileService.deleteFile(fileName);
      const newFileName = await this.fileService.saveFile(fileEn);
      dto.imageEn = `${process.env.BASE_URL}files/${newFileName}`;
    }
    if (fileRu) {
      const fileName = path.basename(foundData.imageRu);
      await this.fileService.deleteFile(fileName);
      const newFileName = await this.fileService.saveFile(fileRu);
      dto.imageRu = `${process.env.BASE_URL}files/${newFileName}`;
    }
    if (fileUz) {
      const fileName = path.basename(foundData.imageUz);
      await this.fileService.deleteFile(fileName);
      const newFileName = await this.fileService.saveFile(fileUz);
      dto.imageUz = `${process.env.BASE_URL}files/${newFileName}`;
    }
    Object.assign(foundData, dto);
    const data = await this.bunnerRepository.update(foundData);
    return new ResData<Bunner>('ok', 200, data);
  }

  async delete(id: string): Promise<ResData<Bunner>> {
    const foundData = await this.bunnerRepository.findById(id);
    if (!foundData) {
      throw new BunnerNotFoundException();
    }
    const fileNameEn = path.basename(foundData.imageEn);
    const fileNameRu = path.basename(foundData.imageRu);
    const fileNameUz = path.basename(foundData.imageUz);
    await this.fileService.deleteFile(fileNameEn);
    await this.fileService.deleteFile(fileNameRu);
    await this.fileService.deleteFile(fileNameUz);
    await this.bunnerRepository.delete(foundData);
    return new ResData<Bunner>('Bunner deleted successfully', 200, foundData);
  }
}
