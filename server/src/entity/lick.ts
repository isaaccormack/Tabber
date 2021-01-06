import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { IsOptional, Length, IsIn, IsInt, Min, Max } from "class-validator";
import { User } from "./user";

@Entity()
export class Lick {
    @PrimaryGeneratedColumn()
    id: number;

    @Length(1, 100)
    @Column()
    name: string;

    @IsOptional()
    @Length(0, 500)
    @Column({ nullable: true })
    description: string;

    // one to one relation with audio file containing
    @Column()
    dateUploaded: Date;

    @Column()
    audioFileLocation: string;

    @Column()
    audioLength: number; // seconds

    @Column({type: "text", nullable: true})
    tab: string;

    @Column()
    @IsIn(["Standard", "Open G", "Drop D"])
    tuning: string; // converts to tuning array with Tuning.fromString()

    @Column()
    @IsInt()
    @Min(0)
    @Max(24)
    capo: number;

    @Column({default: false})
    isPublic: boolean;

    @ManyToOne(type => User, user => user.licks)
    owner: User;

    @ManyToMany(type => User, user => user.sharedWithMe, { cascade: ["update"] })
    @JoinTable()
    sharedWith: User[];
}
