import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Brand } from 'src/common/entities/brand.entity'
import { Color } from 'src/common/entities/color.entity'
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
import { Favorite } from 'src/common/entities/favorite.entity'

export function getTypeormConfig(): TypeOrmModuleOptions {
    if (process.env.DB_HOST === 'localhost') {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Product, ProductColor, ProductSize, ShoeType, Color, Brand, Gender, Season, User, Role, Order, OrderStatus, Favorite],
            synchronize: true
        }
    } else {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Product, ProductColor, ProductSize, ShoeType, Color, Brand, Gender, Season, User, Role, Order, OrderStatus, Favorite],
            synchronize: true,
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
}