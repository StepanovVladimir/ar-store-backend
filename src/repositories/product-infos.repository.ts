import { ProductInfo } from "src/entities/product-info.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ProductInfo)
export class ProductInfosRepository extends Repository<ProductInfo> {}