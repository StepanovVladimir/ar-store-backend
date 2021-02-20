import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import { CartItem } from "./cart-item.entity"
import * as bcrypt from 'bcrypt';

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

    cartItems: CartItem[]

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.passwordHash
    }
}