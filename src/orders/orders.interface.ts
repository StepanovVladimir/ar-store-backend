import { User } from "src/entities/user.entity";

export abstract class OrdersInterface {
    abstract createOrder(user: User)
}