import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Route } from './Route';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  routeId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  mediaUrl?: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    nullable: true,
  })
  mediaType?: MediaType;

  // Relations
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Route, (route) => route.comments)
  @JoinColumn({ name: 'routeId' })
  route!: Route;
}
