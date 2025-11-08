import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Guide {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, })
    title: string;

    @Column({ type: 'varchar', length: 255, })
    description: string;

    @Column({ type: 'varchar', length: 100, })
    location: string;

    @Column({ type: 'varchar', default: 255 })
    notes: string;

    @ManyToOne(()=> User, (user) => user.guides, {eager : true})
    createdBy: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}