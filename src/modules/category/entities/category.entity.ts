import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Product } from "../../products/entities/product.entity";

@Entity('category')
export class Category extends BaseEntity {
    @Column({ type: 'varchar', name:"title_en" })
    titleEn:string

    @Column({ type: 'varchar', name:"title_ru" })
    titleRu:string

    @Column({ type: 'varchar', name:"title_uz" })
    titleUz:string

    @Column({ type: 'varchar', name:"description_en" })
    descriptionEn:string

    @Column({ type: 'varchar', name:"description_ru" })
    descriptionRu:string

    @Column({ type: 'varchar', name:"description_uz" })
    descriptionUz:string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
