import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm"
import { Product } from "./product.entity"
import { User } from "./user.entity"

@Entity()
export class CartItem extends BaseEntity {
    @ManyToOne(() => User, user => user.cartItems, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    user: User

    @PrimaryColumn()
    @RelationId((item: CartItem) => item.user)
    userId: number

    @ManyToOne(() => Product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @PrimaryColumn()
    @RelationId((item: CartItem) => item.product)
    productId: number

    @PrimaryColumn()
    size: number

    @Column()
    quantity: number
}