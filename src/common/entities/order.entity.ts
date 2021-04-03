import { OrderItem } from "./order-item.entity"
import { User } from "./user.entity"

export class Order {
    id: number
    userId: number
    user: User
    time: Date
    items: OrderItem[]
}