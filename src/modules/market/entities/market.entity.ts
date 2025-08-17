import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { MarketList } from '../../market_list/entities/market_list.entity';

@Entity('market')
export class Market extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'boolean', name: 'is_all_buy', default: false })
  isAllBuy: boolean;

  @ManyToMany(() => User, (user) => user.markets)
  @JoinTable({
    name: "market_user",
    joinColumn: {
        name: "market_id",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "user_id",
        referencedColumnName: "id"
    },
  })
  users: User[]

  @OneToMany(() => MarketList, (marketList) => marketList.market, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  marketLists: MarketList[];

  @Column({type: 'decimal', precision: 10, scale: 2 ,name: 'total_price', nullable:true, default: 0})
  totalPrice: number;
}
