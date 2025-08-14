import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'region' })
  region: string;

  @Column({ type: 'varchar', name: 'gender' })
  gender: string;

  @Column({ type: 'varchar', name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'hashed_password', nullable: false })
  hashedPassword: string;

  @Column({ type: 'varchar', name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken: string;
}
