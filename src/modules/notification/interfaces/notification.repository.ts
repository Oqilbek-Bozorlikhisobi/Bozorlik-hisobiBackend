import { QuerySearchUserDto } from '../dto/query-search-user.dto';
import { QuerySearchDto } from '../dto/query-search.dto';
import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  create(dto: Partial<Notification>): Promise<Notification>;
  createMany(entities: Notification[]): Promise<Notification[]>;
  findAllForAdmin(query: QuerySearchDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number | null;
    totalPages: number;
  }>;
  findAllForUser(
    userId: string,
    query: QuerySearchUserDto,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number | null;
    totalPages: number;
  }>;
  update(entity: Notification): Promise<Notification>;
  delete(entity: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
}
