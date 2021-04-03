import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm"
import { Category } from "./category.entity"

@Entity()
export class CategoryInfo extends BaseEntity {
    @ManyToOne(() => Category, category => category.infos, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    category: Category

    @PrimaryColumn()
    @RelationId((info: CategoryInfo) => info.category)
    categoryId: number

    @PrimaryColumn()
    lang: string

    @Column()
    name: string
}