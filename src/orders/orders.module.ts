import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartItemRepository } from 'src/common/repositories/cart-item.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, CartItemRepository, ProductSizeRepository]),
    AuthModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
