import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Brand } from "./brand.entity"
import { ProductColor } from "./product-color.entity"
import { ShoeType } from "./shoe-type.entity"
import { Season } from "./season.entity"
import { Gender } from "./gender.entity"

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Brand, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    brand: Brand

    @Column()
    @Index()
    @RelationId((product: Product) => product.brand)
    brandId: number

    @ManyToOne(() => ShoeType, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    type: ShoeType

    @Column()
    @Index()
    @RelationId((product: Product) => product.type)
    typeId: number

    @ManyToOne(() => Gender, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    gender: Gender

    @Column()
    @Index()
    @RelationId((product: Product) => product.gender)
    genderId: number

    @ManyToOne(() => Season, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    season: Season

    @Column()
    @Index()
    @RelationId((product: Product) => product.season)
    seasonId: number

    @Column()
    image: string

    @Column({ nullable: true })
    volumeModel: string

    @Column()
    liningMaterial: string

    @Column()
    soleMaterial: string

    @Column()
    insoleMaterial: string

    @Column()
    price: number

    @Column()
    discount: number

    @OneToMany(() => ProductColor, color => color.product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    colors: ProductColor[]
}