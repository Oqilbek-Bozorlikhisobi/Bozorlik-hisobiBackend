import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity('histories')
export class History extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'jsonb', name: 'users' })
  users: any;

  @Column({ type: 'jsonb', name: 'market_lists' })
  marketLists: any;
  
  @Column({type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_price'})
  totalPrice : number
}
