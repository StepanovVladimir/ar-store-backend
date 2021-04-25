import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductColor } from "./product-color.entity";

@Entity()
export class Color extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => ProductColor, productColor => productColor.color, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    productColors: ProductColor[]
}