import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProductRepository } from 'src/common/repositories/protuct.repository';
import { ProductInfoRepository } from 'src/common/repositories/product-info.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { CategoryRepository } from 'src/common/repositories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, ProductInfoRepository, ProductSizeRepository, CategoryRepository]),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
