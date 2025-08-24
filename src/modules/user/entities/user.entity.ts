import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Market } from '../../market/entities/market.entity';
import { MarketList } from '../../market_list/entities/market_list.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

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

  @ManyToMany(() => Market, (markets) => markets.users)
  markets: Market[];

  @OneToMany(() => MarketList, (marketList) => marketList.user, {
    onDelete: 'CASCADE',
  })
  marketLists: MarketList[];

  @OneToMany(() => Feedback, (feedback) => feedback.user, {
    onDelete: 'CASCADE',
  })
  feedbacks: Feedback[];
}
