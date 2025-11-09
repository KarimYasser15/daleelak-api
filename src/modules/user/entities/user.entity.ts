import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Guide } from './guide.entity';
import { GuideComment } from '../../guides/entities/guide-comment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, })
    fullName: string;

    @Column({ type: 'varchar', length: 100, })
    email: string;

    @Column({ type: 'varchar', length: 255, })
    password: string;

    @Column({ type: 'int', default: 1 })
    tokenVersion: number;

    @OneToMany(() => Guide, (guide) => guide.createdBy, { eager: false })
    guides: Guide[];

    @OneToMany(() => GuideComment, (comment) => comment.createdBy)
    comments: GuideComment

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}