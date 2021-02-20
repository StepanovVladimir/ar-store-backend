import { Product } from "./product.entity"
import { User } from "./user.entity"

export class CartItem {
    productId: number
    product: Product

    userId: number
    user: User

    quantity: number
}