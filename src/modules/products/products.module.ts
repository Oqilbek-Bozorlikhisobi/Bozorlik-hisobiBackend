import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './products.repository';
import { CategoryModule } from '../category/category.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, FileModule],
  controllers: [ProductsController],
  providers: [
    { provide: 'IProductsService', useClass: ProductsService },
    { provide: 'IProductsRepository', useClass: ProductRepository },
  ],
})
export class ProductsModule {}
