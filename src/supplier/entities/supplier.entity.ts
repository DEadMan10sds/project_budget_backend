import { Resource } from 'src/resources/entities/resource.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'supplier' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {
    nullable: true,
  })
  logo: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @OneToMany(() => Resource, (resoruce) => resoruce.supplier, {
    cascade: true,
    eager: true,
  })
  resources?: Resource[];
}
