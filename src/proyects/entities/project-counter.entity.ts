import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'project-counter' })
export class ProjectCounter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('numeric', {
    nullable: true,
  })
  counter: number;
}
