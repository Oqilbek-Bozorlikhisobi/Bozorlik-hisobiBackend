import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Category } from "../../category/entities/category.entity";

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', name: 'title_en' })
  titleEn: string;

  @Column({ type: 'varchar', name: 'title_ru' })
  titleRu: string;

  @Column({ type: 'varchar', name: 'title_uz' })
  titleUz: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', array: true, name: 'images' })
  images: string[];
}
