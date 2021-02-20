import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm"
import { Product } from "./product.entity"

@Entity()
export class ProductInfo extends BaseEntity {
    @ManyToOne(() => Product, product => product.infos, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @PrimaryColumn()
    @RelationId((info: ProductInfo) => info.product)
    productId: number

    @PrimaryColumn()
    lang: string

    @Column()
    name: string

    @Column("text")
    description: string
}