import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Video } from './Video';
import { Route } from './Route';

@Entity('analyses')
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  videoId!: string;

  @Column('uuid')
  routeId!: string;

  @Column({ type: 'jsonb' })
  poseData!: any;

  @Column({ type: 'float' })
  globalScore!: number;

  @Column({ type: 'jsonb' })
  detailScores!: any;

  @Column({ type: 'jsonb' })
  suggestions!: any;

  @Column({ type: 'jsonb' })
  highlights!: any;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @OneToOne(() => Video, (video) => video.analysis)
  @JoinColumn({ name: 'videoId' })
  video!: Video;

  @ManyToOne(() => Route, (route) => route.analyses)
  @JoinColumn({ name: 'routeId' })
  route!: Route;
}
