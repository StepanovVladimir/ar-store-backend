import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CartItemRepository } from 'src/common/repositories/cart-item.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItemRepository, ProductSizeRepository]),
    AuthModule
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
