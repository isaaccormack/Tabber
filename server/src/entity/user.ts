import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { Lick } from "./lick";

// Don't need to validate this entity, since all data comes
// directly from a Google verified jwt token
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    picture_URL: string;
    
    given_name: string;

    family_name: string;

    @OneToMany(type => Lick, lick => lick.owner)
    licks: Lick[];

    @ManyToMany(type => Lick, lick => lick.sharedWith)
    sharedWithMe: Lick[];
}