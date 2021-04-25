import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Brand } from 'src/common/entities/brand.entity'
import { CartItem } from 'src/common/entities/cart-item.entity'
import { Color } from 'src/common/entities/color.entity'
import { OrderItem } from 'src/common/entities/order-item.entity'
import { OrderStatus } from 'src/common/entities/order-status.entity'
import { Order } from 'src/common/entities/order.entity'
import { ProductColor } from 'src/common/entities/product-color.entity'
import { ProductSize } from 'src/common/entities/product-size.entity'
import { ShoeType } from 'src/common/entities/shoe-type.entity'
import { Product } from 'src/common/entities/product.entity'
import { Role } from 'src/common/entities/role.entity'
import { Season } from 'src/common/entities/season.entity'
import { User } from 'src/common/entities/user.entity'
import { Gender } from 'src/common/entities/gender.entity'

export function getTypeormConfig(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
        port: parseInt(process.env.RDS_PORT) || parseInt(process.env.DB_PORT),
        username: process.env.RDS_USERNAME || process.env.DB_USERNAME,
        password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.RDS_DB_NAME || process.env.DB_NAME,
        entities: [Product, ProductColor, ProductSize, ShoeType, Color, Brand, Gender, Season, User, Role, CartItem, Order, OrderItem, OrderStatus],
        synchronize: true
    }
}