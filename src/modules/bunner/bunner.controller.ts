import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UploadedFile,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { BunnerService } from './bunner.service';
import { CreateBunnerDto } from './dto/create-bunner.dto';
import { UpdateBunnerDto } from './dto/update-bunner.dto';
import { IBunnerService } from './interfaces/bunner.service';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { QuerySearchDto } from './dto/query-search.dto';

@Controller('bunner')
export class BunnerController {
  constructor(
    @Inject('IBunnerService') private readonly bunnerService: IBunnerService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileEn', maxCount: 1 },
      { name: 'fileRu', maxCount: 1 },
      { name: 'fileUz', maxCount: 1 },
    ]),
  )
  @Post()
  create(
    @Body() createBunnerDto: CreateBunnerDto,
    @UploadedFiles()
    files: {
      fileEn?: Express.Multer.File[];
      fileRu?: Express.Multer.File[];
      fileUz?: Express.Multer.File[];
    },
  ) {
    return this.bunnerService.create(
      createBunnerDto,
      files.fileEn![0],
      files.fileRu![0],
      files.fileUz![0],
    );
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.bunnerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bunnerService.findOneById(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileEn', maxCount: 1 },
      { name: 'fileRu', maxCount: 1 },
      { name: 'fileUz', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBunnerDto: UpdateBunnerDto,
    @UploadedFiles()
    files: {
      fileEn?: Express.Multer.File[];
      fileRu?: Express.Multer.File[];
      fileUz?: Express.Multer.File[];
    },
  ) {
    return this.bunnerService.update(
      id,
      updateBunnerDto,
      files.fileEn?.[0],
      files.fileRu?.[0],
      files.fileUz?.[0],
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bunnerService.delete(id);
  }
}
