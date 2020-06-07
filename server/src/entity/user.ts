import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { Length, IsEmail } from "class-validator";
import { Lick } from "./lick";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(2, 80)
    name: string;

    @Column({
        length: 100
    })
    @Length(5, 100)
    @IsEmail()
    email: string;

    @OneToMany(type => Lick, lick => lick.owner)
    licks: Lick[];

    @ManyToMany(type => Lick, lick => lick.sharedWith)
    sharedWithMe: Lick[];
}