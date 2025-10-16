import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MarketList } from '../../market_list/entities/market_list.entity';

@Entity('unit')
export class Unit extends BaseEntity {
  @Column({ type: 'varchar', name: 'name_en', nullable: true })
  nameEn: string;

  @Column({ type: 'varchar', name: 'name_ru', nullable: true })
  nameRu: string;

  @Column({ type: 'varchar', name: 'name_uz', nullable: true })
  nameUz: string;

  @Column({ type: 'varchar', name: 'name_uzk', nullable: true })
  nameUzk: string;

  @OneToMany(() => MarketList, (marketList) => marketList.unit)
  marketLists: MarketList[];
}
