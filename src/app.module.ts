import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { Product } from './entities/product.entity';
import { ProductInfo } from './entities/product-info.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product, ProductInfo, User, Role],
      synchronize: true
    }),
    ProductsModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    AuthModule,
    FilesModule
  ]
})
export class AppModule {}
