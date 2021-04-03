import { BaseEntity, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { CategoryInfo } from "./category-info.entity"
import { Product } from "./product.entity"

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => CategoryInfo, info => info.category, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    infos: CategoryInfo[]

    @ManyToMany(() => Product, product => product.categories, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    products: Product[]
}