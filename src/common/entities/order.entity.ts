import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { OrderItem } from "./order-item.entity"
import { OrderStatus } from "./order-status.entity"
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

    @CreateDateColumn()
    @Index()
    time: Date

    @Column()
    address: string

    @Column()
    postalCode: string

    @ManyToOne(() => OrderStatus, status => status.orders, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    status: OrderStatus

    @Column()
    @RelationId((order: Order) => order.status)
    statusId: number

    @OneToMany(() => OrderItem, item => item.order, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    items: OrderItem[]
}