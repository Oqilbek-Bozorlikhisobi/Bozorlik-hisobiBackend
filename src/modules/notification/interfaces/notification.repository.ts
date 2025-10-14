import { QuerySearchDto } from '../dto/query-search.dto';
import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  create(dto: Notification): Promise<Notification>;
  findAll(query: QuerySearchDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(entity: Notification): Promise<Notification>;
  delete(entity: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
}
