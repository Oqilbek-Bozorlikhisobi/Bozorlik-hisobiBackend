import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationService } from './interfaces/notification.service';
import { INotificationRepository } from './interfaces/notification.repository';
import { IUserRepository } from '../user/interfaces/user.repository';
import { ResData } from '../../common/lib/resData';
import { Notification } from './entities/notification.entity';
import { QuerySearchDto } from './dto/query-search.dto';
import { NotificationNotFoundException } from './exeptions/notification.exeption';
import { UserNotFound } from '../user/exeptions/user.esxeption';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateNotificationDto): Promise<ResData<Notification>> {
    const newNotification = new Notification();
    Object.assign(newNotification, dto);
    const data = await this.notificationRepository.create(newNotification);
    return new ResData<Notification>('ok', 200, data);
  }

  async findAllForAdmin(query: QuerySearchDto): Promise<
    ResData<{
      items: Notification[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  > {
    const data = await this.notificationRepository.findAllForAdmin(query);
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0,
      total: data.total,
      totalPages: data.totalPages,
    });
  }

  async findAllForUser(
    userId: string,
    query: QuerySearchDto,
  ): Promise<
    ResData<{
      items: Notification[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  > {
    const data = await this.notificationRepository.findAllForUser(
      userId,
      query,
    );
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0,
      total: data.total,
      totalPages: data.totalPages,
    });
  }

  async findOneById(id: string): Promise<ResData<Notification>> {
    const foundData = await this.notificationRepository.findById(id);
    if (!foundData) {
      throw new NotificationNotFoundException();
    }
    foundData.isRead = true;
    await this.notificationRepository.update(foundData);
    return new ResData<Notification>('ok', 200, foundData);
  }

  async update(
    id: string,
    dto: UpdateNotificationDto,
  ): Promise<ResData<Notification>> {
    const foundData = await this.notificationRepository.findById(id);
    if (!foundData) {
      throw new NotificationNotFoundException();
    }
    Object.assign(foundData, dto);
    const data = await this.notificationRepository.update(foundData);
    return new ResData<Notification>('ok', 200, data);
  }

  async delete(id: string): Promise<ResData<Notification>> {
    const foundData = await this.notificationRepository.findById(id);
    if (!foundData) {
      throw new NotificationNotFoundException();
    }
    const data = await this.notificationRepository.delete(foundData);
    return new ResData<Notification>('ok', 200, data);
  }

  async makeGlobal(id: string): Promise<ResData<string>> {
    const foundData = await this.notificationRepository.findById(id);
    if (!foundData) {
      throw new NotificationNotFoundException();
    }

    const users = await this.userRepository.findAll({ page: 1, limit: 0 });
    const userNotifications = users.data.map((user) => {
      const newNotif = new Notification();
      Object.assign(newNotif, {
        ...foundData,
        id: undefined,
        isSent: true,
        receiver: user,
        isRead: false,
      });
      return newNotif;
    });

    await this.notificationRepository.delete(foundData);

    await this.notificationRepository.createMany(userNotifications);
    return new ResData<string>('ok', 200, 'ok');
  }

  async clearAllNotifications(userId: string): Promise<ResData<string>> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFound();
    }
    const notifications = await this.notificationRepository.findAllForUser(
      userId,
      { page: 1, limit: 0 },
    );
    notifications.data.forEach(async (notification) => {
      await this.notificationRepository.delete(notification);
    });
    return new ResData<string>('ok', 200, 'All notifications cleared');
  }

  async doAllIsRead(userId: string): Promise<ResData<string>> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFound();
    }

    // Foydalanuvchining barcha notificationlarini olamiz
    const notifications = await this.notificationRepository.findAllForUser(
      userId,
      { page: 1, limit: 0 },
    );

    // Faqat o‘qilmaganlarini filtrlaymiz
    const unreadNotifications = notifications.data.filter((n) => !n.isRead);

    // Hech narsa bo‘lmasa, darrov qaytamiz
    if (unreadNotifications.length === 0) {
      return new ResData('ok', 200, 'All notifications already read');
    }

    // Parallel tarzda update qilamiz
    await Promise.all(
      unreadNotifications.map((n) => {
        n.isRead = true;
        return this.notificationRepository.update(n);
      }),
    );

    return new ResData('ok', 200, 'All notifications marked as read');
  }
}
