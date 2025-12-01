import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'crol-token' })
export class CrolToken {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  token: string;
}
