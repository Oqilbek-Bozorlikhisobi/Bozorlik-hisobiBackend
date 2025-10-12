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
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';

@Controller('bunner')
export class BunnerController {
  constructor(
    @Inject('IBunnerService') private readonly bunnerService: IBunnerService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
    ]),
  )
  @Auth(RoleEnum.ADMIN)
  @Post()
  create(
    @Body() createBunnerDto: CreateBunnerDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },
  ) {
    return this.bunnerService.create(
      createBunnerDto,
      files.file![0]
    );
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.bunnerService.findAll(query);
  }

  @Get('all')
  findAllWithOutPagination() {
    return this.bunnerService.findAllWithOutPagination();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bunnerService.findOneById(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
    ]),
  )
  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBunnerDto: UpdateBunnerDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },
  ) {
    return this.bunnerService.update(
      id,
      updateBunnerDto,
      files.file?.[0]
    );
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bunnerService.delete(id);
  }
}
