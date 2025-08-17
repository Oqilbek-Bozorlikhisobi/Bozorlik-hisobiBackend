import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Market } from '../../market/entities/market.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('market_list')
export class MarketList extends BaseEntity {
  @ManyToOne(() => Market, (market) => market.marketLists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'market_id' })
  market: Market;

  @ManyToOne(() => Product, (product) => product.marketLists, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Column({ type: 'varchar', name: 'product_name', nullable: true })
  productName: string;

  @Column({ type: 'varchar', name: 'product_type', nullable: true })
  productType: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'quantity',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({ type: 'boolean', name: 'is_buying', default: false })
  isBuying: boolean;

  @ManyToOne(() => User, (user) => user.marketLists, { nullable: true })
  @JoinColumn({ name: 'buying_by' })
  user: User;
}
