import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { INotificationRepository } from './interfaces/notification.repository';
import { Repository } from 'typeorm';
import { QuerySearchDto } from './dto/query-search.dto';

export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: Notification): Promise<Notification> {
    const newNotification = await this.notificationRepository.save(dto);
    return newNotification;
  }

  async findAll(query: QuerySearchDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit } = query;

    const qb = this.notificationRepository
      .createQueryBuilder('notification')
      //   .leftJoinAndSelect('notification.market', 'market')
      //   .leftJoinAndSelect('notification.receiver', 'receiver')
      //   .leftJoinAndSelect('notification.sender', 'sender')
      .orderBy('notification.createdAt', 'DESC');

    /**
     * 🔸 Keyinchalik shu joyda receiverId bo‘yicha filter qo‘shiladi:
     *
     * if (receiverId) {
     *   qb.andWhere(
     *     '(notification.isGlobal = true OR notification.receiver_id = :receiverId)',
     *     { receiverId },
     *   );
     * }
     */

    let data: Notification[];
    let total: number;

    if (limit) {
      [data, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    } else {
      [data, total] = await qb.getManyAndCount();
    }

    const appliedLimit = limit ?? total;

    return {
      data,
      total,
      page,
      limit: appliedLimit,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }

  async findById(id: string): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: { id },
      relations: {},
    });
  }

  async update(entity: Notification): Promise<Notification> {
    return await this.notificationRepository.save(entity);
  }

  async delete(entity: Notification): Promise<Notification> {
    return await this.notificationRepository.remove(entity);
  }
}
