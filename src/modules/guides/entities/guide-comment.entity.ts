import { Guide } from '../../user/entities/guide.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class GuideComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    createdBy: User;

    @ManyToOne(() => Guide, guide => guide.comments)
    guide: Guide;

    @Column({ type: 'int', default: 0 })
    upVotes: number;

    @Column({ type: 'int', default: 0 })
    downVotes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
