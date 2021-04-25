import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gender extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}