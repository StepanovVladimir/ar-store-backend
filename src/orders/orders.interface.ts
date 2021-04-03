import { User } from "src/common/entities/user.entity";

export abstract class OrdersInterface {
    abstract createOrder(user: User)
}