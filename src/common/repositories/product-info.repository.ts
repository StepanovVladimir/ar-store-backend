import { ProductInfo } from "../entities/product-info.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ProductInfo)
export class ProductInfoRepository extends Repository<ProductInfo> {}