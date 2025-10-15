import { ResData } from '../../../common/lib/resData';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Notification } from '../entities/notification.entity';

export interface INotificationService {
  create(dto: CreateNotificationDto): Promise<ResData<Notification>>;
  findAllForAdmin(query: QuerySearchDto): Promise<
    ResData<{
      items: Notification[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  findAllForUser(userId:string, query: QuerySearchDto): Promise<
    ResData<{
      items: Notification[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  findOneById(id: string): Promise<ResData<Notification>>;
  update(
    id: string,
    dto: UpdateNotificationDto,
  ): Promise<ResData<Notification>>;
  delete(id: string): Promise<ResData<Notification>>;
  makeGlobal(id:string): Promise<ResData<string>>;
  clearAllNotifications(userId:string): Promise<ResData<string>>;
  doAllIsRead(userId:string): Promise<ResData<string>>;
}
