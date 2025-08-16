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

  @Column({ type: 'varchar', name: 'image_en' })
  imageEn: string;

  @Column({ type: 'varchar', name: 'image_ru' })
  imageRu: string;

  @Column({ type: 'varchar', name: 'image_uz' })
  imageUz: string;
}
