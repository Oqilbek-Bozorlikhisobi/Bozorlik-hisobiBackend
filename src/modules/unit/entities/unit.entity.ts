import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { MarketList } from "../../market_list/entities/market_list.entity";

@Entity('unit')
export class Unit extends BaseEntity {
    
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @OneToMany(() => MarketList, (marketList) => marketList.unit)
  marketLists: MarketList[];

}
