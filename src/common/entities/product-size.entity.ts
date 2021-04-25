import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { ProductColor } from "./product-color.entity";

@Entity()
export class ProductSize extends BaseEntity {
    @PrimaryColumn()
    size: number

    @ManyToOne(() => ProductColor, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    color: ProductColor

    @PrimaryColumn()
    @RelationId((size: ProductSize) => size.color)
    colorId: number

    @Column()
    quantity: number
}