import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { OrderStatusRepository } from 'src/common/repositories/order-status.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderStatusRepository, ProductSizeRepository]),
    AuthModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
