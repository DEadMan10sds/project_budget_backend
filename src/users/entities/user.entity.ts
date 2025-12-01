import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  username: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', {
    array: true,
    default: ['engineer'],
  })
  roles: string[];

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Proyect, (proyect) => proyect.seller)
  proyect?: Proyect[];

  @OneToMany(() => Resource, (resource) => resource.user)
  resources?: Resource[];
}
