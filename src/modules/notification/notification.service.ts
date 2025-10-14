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

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateNotificationDto): Promise<ResData<Notification>> {
    // const users = await this.userRepository.findAll()
    const newNotification = new Notification()
    Object.assign(newNotification, dto)
    const data = await this.notificationRepository.create(newNotification)
    return new ResData<Notification>('ok', 200, data)
  }

  async findAll(query: QuerySearchDto): Promise<ResData<{ items: Notification[]; page: number; limit: number; total: number; totalPages: number; }>> {
    const data = await this.notificationRepository.findAll(query)
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0,
      total: data.total,
      totalPages: data.totalPages,
    });
  }

  async findOneById(id: string): Promise<ResData<Notification>> {
    const foundData = await this.notificationRepository.findById(id)
    if (!foundData) {
      throw new NotificationNotFoundException()
    }
    return new ResData<Notification>('ok', 200, foundData)
  }

  async delete(id: string): Promise<ResData<Notification>> {
    const foundData = await this.notificationRepository.findById(id);
    if (!foundData) {
      throw new NotificationNotFoundException();
    }
    const data = await this.notificationRepository.delete(foundData);
    return new ResData<Notification>('ok', 200, data);
  }
}
