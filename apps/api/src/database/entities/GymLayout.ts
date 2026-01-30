import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * GymLayout Entity
 * Stores SVG-based gym floor plans for interactive sector selection
 */
@Entity('gym_layouts')
export class GymLayout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string; // e.g., 'main_gym', 'training_area'

  @Column({ type: 'text' })
  svgContent!: string; // Raw SVG markup

  @Column({ type: 'jsonb', nullable: true })
  sectorMappings?: {
    [sectorId: string]: {
      label: string;
      pathId: string;
      coordinates?: { x: number; y: number };
    };
  }; // Mapping of sectors to SVG elements

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // Whether this layout is currently active

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
