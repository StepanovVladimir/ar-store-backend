import { Module } from '@nestjs/common';
import { ProductsInterface } from 'src/products/products.interface';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from 'src/repositories/protucts.repository';
import { ProductInfosRepository } from 'src/repositories/product-infos.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsRepository, ProductInfosRepository]),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [{ provide: ProductsInterface, useClass: ProductsService }]
})
export class ProductsModule {}
