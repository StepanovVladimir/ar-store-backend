import { EntityRepository, Repository } from "typeorm";
import { OrderStatus } from "../entities/order-status.entity";

@EntityRepository(OrderStatus)
export class OrderStatusRepository extends Repository<OrderStatus> {}