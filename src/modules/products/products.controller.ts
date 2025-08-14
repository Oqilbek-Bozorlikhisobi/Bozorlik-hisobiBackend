import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFiles, Query, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IProductsService } from './interfaces/products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuerySearchDto } from './dto/query-search.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query:QuerySearchDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
