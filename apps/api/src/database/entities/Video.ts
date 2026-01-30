import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Analysis } from './Analysis';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Column({ type: 'varchar', length: 255 })
  thumbnailUrl!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  routeId!: string;

  @CreateDateColumn()
  uploadedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.videos)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToOne(() => Analysis, (analysis) => analysis.video, { nullable: true })
  analysis?: Analysis;
}
