import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { GuideComment } from '../../guides/entities/guide-comment.entity';

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

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes: string;

    @ManyToOne(() => User, (user) => user.guides, { eager: true })
    createdBy: User;

    @Column({ type: 'int', default: 0 })
    upVotes: number;

    @Column({ type: 'int', default: 0 })
    downVotes: number;

    @OneToMany(() => GuideComment, (comment) => comment.guide)
    comments: GuideComment[]

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}