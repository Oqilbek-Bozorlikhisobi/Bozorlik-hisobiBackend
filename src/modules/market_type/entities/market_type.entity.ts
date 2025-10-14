import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Market } from '../../market/entities/market.entity';

@Entity('market_type')
export class MarketType extends BaseEntity {
  @Column({ type: 'varchar', name: 'title_en' })
  titleEn: string;

  @Column({ type: 'varchar', name: 'title_ru' })
  titleRu: string;

  @Column({ type: 'varchar', name: 'title_uz' })
  titleUz: string;

  @Column({ type: 'varchar', name: 'title_uzk', nullable: true })
  titleUzk: string;

  @Column({ type: 'varchar', name: 'image', nullable: true })
  image: string;

  @OneToMany(() => Market, (market) => market.marketType)
  markets: Market[];
}
