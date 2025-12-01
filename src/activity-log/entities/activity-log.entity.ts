import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'activity_log' })
export class ActivityLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  action: string;

  @Column('text', {
    nullable: true,
  })
  fromState: string;

  @Column('text')
  toState: string;

  @ManyToOne(() => Proyect)
  @JoinColumn()
  project: Proyect;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Resource)
  @JoinColumn()
  product: Resource;

  @Column('date')
  date: Date;
}
