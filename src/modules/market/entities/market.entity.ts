import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { MarketList } from '../../market_list/entities/market_list.entity';
import { MarketType } from '../../market_type/entities/market_type.entity';

@Entity('market')
export class Market extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'boolean', name: 'is_all_buy', default: false })
  isAllBuy: boolean;

  @ManyToMany(() => User, (user) => user.markets)
  @JoinTable({
    name: 'market_user',
    joinColumn: {
      name: 'market_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @Column({ type: 'uuid', name: 'market_creator', nullable: true })
  marketCreator: string;

  @Column({ type: 'simple-json', name: 'pending_users', nullable: true })
  pendingUsers: {
    id: string;
    phoneNumber: string;
    note?: string;
    createdAt: Date;
  }[];

  @OneToMany(() => MarketList, (marketList) => marketList.market, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  marketLists: MarketList[];

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'total_price',
    nullable: true,
    default: 0,
  })
  totalPrice: number;

  @Column({ type: 'varchar', name: 'location', nullable: true })
  location: string;

  @ManyToOne(() => MarketType, (marketType) => marketType.markets, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'market_type_id' })
  marketType: MarketType;

  @Column({ type: 'boolean', name: 'is_current', default: false })
  isCurrent: boolean;
}
