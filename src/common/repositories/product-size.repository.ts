import { EntityRepository, Repository } from "typeorm";
import { ProductSize } from "../entities/product-size.entity";

@EntityRepository(ProductSize)
export class ProductSizeRepository extends Repository<ProductSize> {}