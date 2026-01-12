import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Route } from './Route';
import { Validation } from './Validation';
import { Comment } from './Comment';
import { Video } from './Video';

export enum UserRole {
  CLIMBER = 'CLIMBER',
  OPENER = 'OPENER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column('varchar')
  password!: string;

  @Column('varchar')
  name!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIMBER,
  })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ type: 'integer', nullable: true })
  age?: number;

  @Column({ type: 'integer', nullable: true })
  height?: number; // height in cm

  @Column({ type: 'integer', nullable: true })
  wingspan?: number; // wingspan in cm (envergure)

  @Column({ type: 'varchar', nullable: true })
  profilePhoto?: string; // Cloudinary URL

  @Column({ type: 'jsonb', nullable: true })
  additionalPhotos?: string[]; // Array of Cloudinary URLs

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Route, (route) => route.opener)
  routes!: Route[];

  @OneToMany(() => Validation, (validation) => validation.user)
  validations!: Validation[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => Video, (video) => video.user)
  videos!: Video[];
}
