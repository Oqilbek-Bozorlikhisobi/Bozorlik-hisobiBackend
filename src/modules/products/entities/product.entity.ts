import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Category } from "../../category/entities/category.entity";
import { MarketList } from "../../market_list/entities/market_list.entity";

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', name: 'title_en' })
  titleEn: string;

  @Column({ type: 'varchar', name: 'title_ru' })
  titleRu: string;

  @Column({ type: 'varchar', name: 'title_uz' })
  titleUz: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', name: 'images' })
  images: string;

  @OneToMany(() => MarketList, (marketList) => marketList.product)
  marketLists: MarketList[];
}
