import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Category } from "./category.entity"
import { ProductInfo } from "./product-info.entity"
import { ProductSize } from "./product-size.entity"

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    image: string

    @Column()
    volumeModel: string

    @Column()
    price: number

    @Column()
    discount: number

    @OneToMany(() => ProductInfo, info => info.product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    infos: ProductInfo[]

    @OneToMany(() => ProductSize, size => size.product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    sizes: ProductSize[]

    @ManyToMany(() => Category, category => category.products, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    @JoinTable()
    categories: Category[]
}