import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Color } from "./color.entity"
import { OrderStatus } from "./order-status.entity"
import { Product } from "./product.entity"
import { User } from "./user.entity"

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.orders, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    user: User

    @Column()
    @RelationId((order: Order) => order.user)
    userId: number

    @Column()
    createdTime: Date

    @Column()
    @Index()
    updatedTime: Date;

    @Column()
    address: string

    @Column()
    postalCode: string

    @ManyToOne(() => OrderStatus, status => status.orders, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    status: OrderStatus

    @Column()
    @RelationId((order: Order) => order.status)
    statusId: number

    @Column({ nullable: true })
    trackCode: string

    @ManyToOne(() => Product, product => product.orders, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @Column()
    @Index()
    @RelationId((order: Order) => order.product)
    productId: number

    @ManyToOne(() => Color, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    color: Color

    @Column()
    @RelationId((order: Order) => order.color)
    colorId: number

    @Column()
    size: number

    @Column()
    price: number

    @Column({ nullable: true })
    estimation: number

    @Column({ nullable: true })
    comment: string

    @Column({ nullable: true })
    @Index()
    estimationDate: Date
}