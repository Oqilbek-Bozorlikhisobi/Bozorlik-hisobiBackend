import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('bunner')
export class Bunner extends BaseEntity {
  @Column({ type: 'varchar', name: 'name_en' })
  nameEn: string;

  @Column({ type: 'varchar', name: 'name_ru' })
  nameRu: string;

  @Column({ type: 'varchar', name: 'name_uz' })
  nameUz: string;

  @Column({type: "varchar", name: "name_uzk", nullable: true})
  nameUzk: string;

  @Column({ type: "varchar", name: "image", nullable: true })
  image: string;

  @Column({ type: 'varchar', name: 'link', nullable: true})
  link: string;
}
