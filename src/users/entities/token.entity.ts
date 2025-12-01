import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'passwordtoken' })
export class PasswordToken {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  email: string;

  @Column('uuid')
  userId: string;

  @Column('numeric')
  token: number;

  @Column('date')
  expiration: Date;
}
