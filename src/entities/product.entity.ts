import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ArType } from "./ar-type.entity"
import { Category } from "./category.entity"
import { ProductInfo } from "./product-info.entity"

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

    @Column()
    available: boolean

    @OneToMany(() => ProductInfo, info => info.product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    infos: ProductInfo[]

    /*categories: Category[]

    arTypeId: number

    arType: ArType*/
}