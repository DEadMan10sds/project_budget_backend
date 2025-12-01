import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'resource_counter' })
export class ResourceCounter {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('numeric')
  total: number;
}
