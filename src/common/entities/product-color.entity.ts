import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Color } from "./color.entity";
import { ProductSize } from "./product-size.entity";
import { Product } from "./product.entity";

@Entity()
@Index(['productId', 'colorId'], { unique: true })
export class ProductColor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Product, product => product.colors, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    product: Product

    @Column()
    @RelationId((color: ProductColor) => color.product)
    productId: number

    @ManyToOne(() => Color, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    color: Color

    @Column()
    @RelationId((color: ProductColor) => color.color)
    colorId: number

    @Column()
    texture: string

    @OneToMany(() => ProductSize, size => size.color, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    sizes: ProductSize[]
}