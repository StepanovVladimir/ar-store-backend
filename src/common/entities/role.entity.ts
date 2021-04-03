import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column()
    name: string

    @OneToMany(() => User, user => user.role, { onUpdate: "CASCADE", onDelete: "CASCADE" })
    users: User[]
}