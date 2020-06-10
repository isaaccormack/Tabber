import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Length, IsOptional } from "class-validator";
import { User } from "./user";

// should Lick be plural so db table is licks not lick?
// this should be weak entity which is defined by its name and user name such that each name is unique to user 

@Entity()
export class Lick {
    @PrimaryGeneratedColumn()
    id: number;

    @Length(1, 100)
    @Column({ length: 100 })
    name: string;
    
    @Length(0, 500)
    @Column({ length: 500 })
    description: string;
    
    @Column()
    dateUploaded: Date;
    
    // dont need to validate since server
    // @Length(1, 50)
    @Column({ length: 50 })
    audioFileLocation: string;
    
    // dont need to validate since server
    // @IsPositive()
    // @Max(60)	
    @Column()
    audioLength: number; // seconds
    
    // put constraints on here later
    @Column({ length: 100 }) // unsure of what length should be, maybe this should even be saved as file since
    tab: string; // TODO: make tab data structure

    @Length(1, 20)
    @Column({ length: 20 })
    tuning: string; // TODO: make tuning data structure/data type

    @Column()
    isPublic: boolean;

    @ManyToOne(type => User, owner => owner.licks)
    owner: User;

    @ManyToMany(type => User, user => user.sharedWithMe)
    @JoinTable()
    sharedWith: User[];
}