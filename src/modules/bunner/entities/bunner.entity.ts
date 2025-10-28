import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('bunner')
export class Bunner extends BaseEntity {
  @Column({ type: 'varchar', name: 'image_en', nullable: true })
  imageEn: string;

  @Column({ type: 'varchar', name: 'image_ru', nullable: true })
  imageRu: string;

  @Column({ type: 'varchar', name: 'image_uz', nullable: true })
  imageUz: string;

  @Column({ type: 'varchar', name: 'image_uzk', nullable: true })
  imageUzk: string;

  @Column({ type: 'varchar', name: 'link', nullable: true })
  link: string;
}
