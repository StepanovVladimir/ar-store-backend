import { EntityRepository, Repository } from "typeorm";
import { ProductColor } from "../entities/product-color.entity";

@EntityRepository(ProductColor)
export class ProductColorRepository extends Repository<ProductColor> {}