import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm"
import { Order } from "./order.entity"
import { Product } from "./product.entity"

@Entity()
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order, order => order.items, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    order: Order
    
    @PrimaryColumn()
    @RelationId((item: OrderItem) => item.order)
    orderId: number
    
    @ManyToOne(() => Product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @PrimaryColumn()
    @RelationId((item: OrderItem) => item.product)
    productId: number

    @PrimaryColumn()
    size: number

    @Column()
    price: number

    @Column()
    quantity: number
}