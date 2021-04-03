import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductSize extends BaseEntity {
    @ManyToOne(() => Product, product => product.sizes, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @PrimaryColumn()
    @RelationId((size: ProductSize) => size.product)
    productId: number

    @PrimaryColumn()
    size: number

    @Column()
    quantity: number
}