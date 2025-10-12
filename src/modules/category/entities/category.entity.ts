import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', name: 'title_en' })
  titleEn: string;

  @Column({ type: 'varchar', name: 'title_ru' })
  titleRu: string;

  @Column({ type: 'varchar', name: 'title_uz' })
  titleUz: string;

  @Column({ type: 'varchar', name: 'title_uzk', nullable:true })
  titleUzk: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  products: Product[];

  @Column({ type: 'varchar', name: 'image', nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category

  @OneToMany(() => Category, (category) => category.parent, {
    cascade: true,
  })
  children: Category[];
}
