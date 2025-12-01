import { Resource } from 'src/resources/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'proyects' })
export class Proyect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  crol_id: string;

  @Column('text', {
    unique: true,
  })
  external_id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  client: string;

  @Column('numeric', {
    default: 0,
  })
  estimated_price: number;

  @Column('numeric', {
    default: 0,
  })
  real_price: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('numeric')
  divisionId: number;

  @Column('numeric')
  budget: number;

  @ManyToOne(() => User, (user) => user.proyect, { eager: true, cascade: true })
  seller: User;

  @OneToMany(() => Resource, (resource) => resource.proyect, {
    cascade: true,
    eager: true,
  })
  resources?: Resource[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
