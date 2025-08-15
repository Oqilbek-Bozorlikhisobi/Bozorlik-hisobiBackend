import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

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
}
