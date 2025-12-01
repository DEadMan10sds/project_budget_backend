import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'resource' })
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  crol_id: string;

  //Método de costeo -> 1(primera entrada primera salida) o 2(costo promedio)
  @Column('numeric')
  cost_method: number;

  //Tipo -> 1(Producto) o 2(Servicio)
  @Column('numeric')
  type: number;

  @Column('text')
  name: string;

  @Column('numeric')
  estimated_price: number;

  @Column('numeric', {
    default: 0.0,
  })
  real_price: number;

  @Column('text')
  measurement_unit: string;

  @Column('numeric')
  quantity: number;

  @Column('text')
  status: string;

  @Column('date', {
    nullable: true,
  })
  bougth_on: Date;

  @Column('date', {
    nullable: true,
  })
  eta: Date;

  @Column('text')
  sat_code: string;

  @Column('text')
  link: string;

  @Column('text', {
    nullable: true,
  })
  notes: string;

  @Column('text')
  sku: string;

  @Column('text')
  description: string;

  @Column('text')
  coin: string;

  // @Column('text')
  // clasification: string;

  @Column('numeric', {
    nullable: true,
  })
  subtotal: number;

  @Column('bool', {
    default: false,
  })
  approved: boolean;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('numeric')
  service_group: number;

  @ManyToOne(() => Category, (category) => category.resources, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Proyect, (proyect) => proyect.resources, {
    onDelete: 'CASCADE',
  })
  proyect: Proyect;

  @ManyToOne(() => User, (user) => user.resources, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Supplier, (supplier) => supplier.resources, {
    onDelete: 'CASCADE',
  })
  supplier: Supplier;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
