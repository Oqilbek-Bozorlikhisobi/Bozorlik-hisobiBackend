import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Market } from '../../market/entities/market.entity';
import { User } from '../../user/entities/user.entity';

@Entity('notification')
export class Notification extends BaseEntity {
  @Column({ type: 'varchar', name: 'title_en' })
  titleEn: string;

  @Column({ type: 'varchar', name: 'title_ru' })
  titleRu: string;

  @Column({ type: 'varchar', name: 'title_uz' })
  titleUz: string;

  @Column({ type: 'varchar', name: 'title_uzk' })
  titleUzk: string;

  @Column({ type: 'varchar', name: 'message_en' })
  messageEn: string;

  @Column({ type: 'varchar', name: 'message_ru' })
  messageRu: string;

  @Column({ type: 'varchar', name: 'message_uz' })
  messageUz: string;

  @Column({ type: 'varchar', name: 'message_uzk' })
  messageUzk: string;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead: boolean;

  // Global bo‘lsa → barcha userlarga
  @Column({ type: 'boolean', name: 'is_global', default: false })
  isGlobal: boolean;

  @Column({ type: 'boolean', name: 'is_sent', default: false })
  isSent: boolean; // Admin global qilgach, userlarga yuborilganligini belgilaydi

  // Marketga bog‘liq notification (taklif uchun)
  @ManyToOne(() => Market, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'market_id' })
  market: Market;

  // Kimga yuborilgan
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  // Taklif qilgan odam
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
