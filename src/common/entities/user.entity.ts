import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Role } from "./role.entity";
import { Order } from "./order.entity";
import { Favorite } from "./favorite.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column()
    email: string

    @Column()
    passwordHash: string

    @Column()
    salt: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    confirmed: boolean

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    postalCode: string

    @ManyToOne(() => Role, role => role.users, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    role: Role

    @Column()
    @Index()
    @RelationId((user: User) => user.role)
    roleId: number

    @OneToMany(() => Order, order => order.user, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    orders: Order[]

    @OneToMany(() => Favorite, favorite => favorite.user, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    favorites: Favorite[]
}