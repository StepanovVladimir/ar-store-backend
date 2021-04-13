import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { CartItem } from 'src/common/entities/cart-item.entity'
import { CategoryInfo } from 'src/common/entities/category-info.entity'
import { Category } from 'src/common/entities/category.entity'
import { OrderItem } from 'src/common/entities/order-item.entity'
import { OrderStatus } from 'src/common/entities/order-status.entity'
import { Order } from 'src/common/entities/order.entity'
import { ProductInfo } from 'src/common/entities/product-info.entity'
import { ProductSize } from 'src/common/entities/product-size.entity'
import { Product } from 'src/common/entities/product.entity'
import { Role } from 'src/common/entities/role.entity'
import { User } from 'src/common/entities/user.entity'

export function getTypeormConfig(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
        port: parseInt(process.env.RDS_PORT) || parseInt(process.env.DB_PORT),
        username: process.env.RDS_USERNAME || process.env.DB_USERNAME,
        password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.RDS_DB_NAME || process.env.DB_NAME,
        entities: [Product, ProductSize, ProductInfo, User, Role, Category, CategoryInfo, CartItem, Order, OrderItem, OrderStatus],
        synchronize: true
    }
}