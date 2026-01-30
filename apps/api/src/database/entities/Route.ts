import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Validation } from './Validation';
import { Comment } from './Comment';
import { Analysis } from './Analysis';

export enum RouteStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

// Couleurs utilisées comme difficulté/cotation (dans le bon ordre)
export enum DifficultyColor {
  VERT = 'Vert',
  VERT_CLAIR = 'Vert clair',
  BLEU_CLAIR = 'Bleu clair',
  BLEU_FONCE = 'Bleu foncé',
  VIOLET = 'Violet',
  ROSE = 'Rose',
  ROUGE = 'Rouge',
  ORANGE = 'Orange',
  JAUNE = 'Jaune',
  BLANC = 'Blanc',
  GRIS = 'Gris',
  NOIR = 'Noir',
}

export enum HoldColorCategory {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  PURPLE = 'purple',
  PINK = 'pink',
  BLACK = 'black',
  WHITE = 'white',
  GREY = 'grey',
}

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: DifficultyColor,
  })
  difficulty!: DifficultyColor;

  @Column({ type: 'varchar', length: 50 })
  holdColorHex!: string; // Hex color of holds, e.g., #FF5733

  @Column({
    type: 'enum',
    enum: HoldColorCategory,
  })
  holdColorCategory!: HoldColorCategory; // Category for filtering (red, blue, etc.)

  @Column({ type: 'varchar', length: 255 })
  sector!: string;

  @Column({ type: 'jsonb', nullable: true })
  routeTypes?: string[]; // Array of route characteristics (réglette, dévers, etc.)

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  tips?: string;

  @Column('uuid')
  openerId!: string;

  @ManyToOne(() => User, (user) => user.routes)
  @JoinColumn({ name: 'openerId' })
  opener!: User;

  @Column({ type: 'varchar', length: 255 })
  mainPhoto!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  openingVideo?: string;

  @Column({
    type: 'enum',
    enum: RouteStatus,
    default: RouteStatus.PENDING,
  })
  status!: RouteStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  openedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  holdMapping?: any;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Validation, (validation) => validation.route)
  validations!: Validation[];

  @OneToMany(() => Comment, (comment) => comment.route)
  comments!: Comment[];

  @OneToMany(() => Analysis, (analysis) => analysis.route)
  analyses!: Analysis[];
}
