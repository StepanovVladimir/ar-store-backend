import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProductRepository } from 'src/common/repositories/protuct.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { ProductColorRepository } from 'src/common/repositories/product-color.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, ProductColorRepository, ProductSizeRepository]),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
