import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ProductInfo } from "src/entities/product-info.entity";
import { Product } from "src/entities/product.entity";
import { User } from "src/entities/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '8991',
    database: 'arstore',
    entities: [Product, ProductInfo, User],
    synchronize: true
}