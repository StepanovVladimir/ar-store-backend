import { EntityRepository, Repository } from "typeorm";
import { CartItem } from "../entities/cart-item.entity";

@EntityRepository(CartItem)
export class CartItemRepository extends Repository<CartItem> {}