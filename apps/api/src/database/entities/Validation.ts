import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Route } from './Route';

export enum ValidationStatus {
  EN_PROJET = 'EN_PROJET', // En cours de travail
  VALIDE = 'VALIDE', // Réussie
}

@Entity('validations')
@Unique(['userId', 'routeId'])
export class Validation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  routeId!: string;

  @CreateDateColumn()
  validatedAt!: Date;

  @Column({ type: 'text', nullable: true })
  personalNote?: string;

  @Column({
    type: 'enum',
    enum: ValidationStatus,
    default: ValidationStatus.EN_PROJET,
  })
  status!: ValidationStatus;

  @Column({ type: 'integer', default: 1 })
  attempts!: number; // Nombre d'essais

  @Column({ type: 'boolean', default: false })
  isFlashed!: boolean; // Validé du premier coup

  @Column({ type: 'boolean', default: false })
  isFavorite!: boolean; // Marqué comme favori

  // Relations
  @ManyToOne(() => User, (user) => user.validations)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Route, (route) => route.validations)
  @JoinColumn({ name: 'routeId' })
  route!: Route;
}
