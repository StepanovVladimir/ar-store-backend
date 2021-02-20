import { Order } from "./order.entity"
import { Product } from "./product.entity"

export class OrderItem {
    orderId: number
    order: Order

    productId: number
    product: Product

    price: number
    quantity: number
}