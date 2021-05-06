import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getTypeormConfig } from './config/typeorm.config';
import { SellersModule } from './sellers/sellers.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getTypeormConfig()),
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    AuthModule,
    SellersModule,
    FavoritesModule
  ]
})
export class AppModule {}
