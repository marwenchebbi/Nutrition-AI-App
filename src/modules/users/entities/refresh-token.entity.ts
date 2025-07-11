import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class RefreshToken{
    @PrimaryGeneratedColumn()
    id : number
    @Column()
    token :  string
    @Column()
    expiryDate  : Date

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}