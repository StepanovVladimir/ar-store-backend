import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { CartItem } from "./cart-item.entity"
import * as bcrypt from 'bcrypt';
import { Role } from "./role.entity";

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

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    postalCode: string

    @ManyToOne(() => Role, role => role.users, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    role: Role

    @Column()
    @RelationId((user: User) => user.role)
    roleId: number

    cartItems: CartItem[]

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.passwordHash
    }
}