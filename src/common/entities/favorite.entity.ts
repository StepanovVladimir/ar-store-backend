import { BaseEntity, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity()
export class Favorite extends BaseEntity {
    @ManyToOne(() => User, user => user.favorites, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    user: User

    @PrimaryColumn()
    @RelationId((favorite: Favorite) => favorite.user)
    userId: number

    @ManyToOne(() => Product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @PrimaryColumn()
    @RelationId((favorite: Favorite) => favorite.product)
    productId: number
}