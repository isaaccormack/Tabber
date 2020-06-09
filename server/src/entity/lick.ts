import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Length } from "class-validator";
import { User } from "./user";

// should Lick be plural so db table is licks not lick?

@Entity()
export class Lick {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    @Length(1, 100)
    name: string;

    @Column()
    description: string;

    @Column()
    dateUploaded: Date;

    @Column()
    audioFileLocation: string;

    @Column()
    audioLength: number; // seconds

    @Column()
    tab: string; // TODO: make tab data structure

    @Column()
    tuning: string; // TODO: make tuning data structure/data type

    @Column()
    isPublic: boolean;

    @ManyToOne(type => User, owner => owner.licks)
    owner: User;

    @ManyToMany(type => User, user => user.sharedWithMe)
    @JoinTable()
    sharedWith: User[];
}