import { Product } from "src/entities/product.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {}