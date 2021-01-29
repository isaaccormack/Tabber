import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LickCount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;
}
