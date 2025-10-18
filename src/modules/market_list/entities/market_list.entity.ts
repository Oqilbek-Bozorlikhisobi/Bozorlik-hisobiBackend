import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Market } from '../../market/entities/market.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import { Unit } from '../../unit/entities/unit.entity';
import { CalculationType } from '../../../common/enums/enum';

@Entity('market_list')
export class MarketList extends BaseEntity {
  @ManyToOne(() => Market, (market) => market.marketLists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'market_id' })
  market: Market;

  @ManyToOne(() => Product, (product) => product.marketLists, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Column({ type: 'varchar', name: 'product_name', nullable: true })
  productName: string;

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
    precision: 15,
    scale: 2,
    name: 'price',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    type: 'enum',
    enum: CalculationType,
    name: 'calculation_type',
    default: CalculationType.ONE,
  })
  calculationType: CalculationType;

  @Column({ type: 'boolean', name: 'is_buying', default: false })
  isBuying: boolean;

  @Column({ type: 'text', name: 'description', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.marketLists, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'buying_by' })
  user: User;

  @ManyToOne(() => Unit, (unit) => unit.marketLists, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit | null;
}
