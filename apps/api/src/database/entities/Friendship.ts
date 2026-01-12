import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum FriendshipStatus {
  PENDING = 'PENDING', // Demande en attente
  ACCEPTED = 'ACCEPTED', // Amitié acceptée
  REJECTED = 'REJECTED', // Demande rejetée
}

@Entity('friendships')
@Index(['requesterId', 'addresseeId'], { unique: true }) // Empêche les doublons
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  requesterId!: string; // Celui qui envoie la demande

  @Column('uuid')
  addresseeId!: string; // Celui qui reçoit la demande

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status!: FriendshipStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requesterId' })
  requester!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'addresseeId' })
  addressee!: User;
}
