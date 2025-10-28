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
    files: {
      fileEn?: Express.Multer.File;
      fileRu?: Express.Multer.File;
      fileUz?: Express.Multer.File;
      fileUzk?: Express.Multer.File;
    },
  ): Promise<ResData<Bunner>> {
    if (!files.fileEn || !files.fileRu || !files.fileUz || !files.fileUzk) {
      throw new FileIsMissinExeption();
    }
    const fileNameEn = await this.fileService.saveFile(files.fileEn);
    const fileNameRu = await this.fileService.saveFile(files.fileRu);
    const fileNameUz = await this.fileService.saveFile(files.fileUz);
    const fileNameUzk = await this.fileService.saveFile(files.fileUzk);
    dto.imageEn = `${process.env.BASE_URL}files/${fileNameEn}`;
    dto.imageRu = `${process.env.BASE_URL}files/${fileNameRu}`;
    dto.imageUz = `${process.env.BASE_URL}files/${fileNameUz}`;
    dto.imageUzk = `${process.env.BASE_URL}files/${fileNameUzk}`;
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
    const data = await this.bunnerRepository.findAllWithOutPagination();
    return new ResData<Bunner[]>('ok', 200, data);
  }

  async update(
    id: string,
    dto: UpdateBunnerDto,
    files?: {
      fileEn?: Express.Multer.File;
      fileRu?: Express.Multer.File;
      fileUz?: Express.Multer.File;
      fileUzk?: Express.Multer.File;
    },
  ): Promise<ResData<Bunner>> {
    const foundData = await this.bunnerRepository.findById(id);
    if (!foundData) {
      throw new BunnerNotFoundException();
    }

    // EN
    if (files?.fileEn) {
      const oldFile = path.basename(foundData.imageEn);
      await this.fileService.deleteFile(oldFile);
      const newFile = await this.fileService.saveFile(files.fileEn);
      dto.imageEn = `${process.env.BASE_URL}files/${newFile}`;
    }

    // RU
    if (files?.fileRu) {
      const oldFile = path.basename(foundData.imageRu);
      await this.fileService.deleteFile(oldFile);
      const newFile = await this.fileService.saveFile(files.fileRu);
      dto.imageRu = `${process.env.BASE_URL}files/${newFile}`;
    }

    // UZ
    if (files?.fileUz) {
      const oldFile = path.basename(foundData.imageUz);
      await this.fileService.deleteFile(oldFile);
      const newFile = await this.fileService.saveFile(files.fileUz);
      dto.imageUz = `${process.env.BASE_URL}files/${newFile}`;
    }

    // UZK
    if (files?.fileUzk) {
      const oldFile = path.basename(foundData.imageUzk);
      await this.fileService.deleteFile(oldFile);
      const newFile = await this.fileService.saveFile(files.fileUzk);
      dto.imageUzk = `${process.env.BASE_URL}files/${newFile}`;
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
    const fileNameUzk = path.basename(foundData.imageUzk);
    await this.fileService.deleteFile(fileNameEn);
    await this.fileService.deleteFile(fileNameRu);
    await this.fileService.deleteFile(fileNameUz);
    await this.fileService.deleteFile(fileNameUzk);
    await this.bunnerRepository.delete(foundData);
    return new ResData<Bunner>('Bunner deleted successfully', 200, foundData);
  }
}
