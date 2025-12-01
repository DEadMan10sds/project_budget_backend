import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Resource, (resource) => resource.category, {
    cascade: true,
    eager: true,
  })
  resources?: Resource[];
}
