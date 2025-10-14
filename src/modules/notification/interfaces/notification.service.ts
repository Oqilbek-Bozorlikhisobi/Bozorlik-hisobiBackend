import { ResData } from "../../../common/lib/resData";
import { CreateNotificationDto } from "../dto/create-notification.dto";
import { QuerySearchDto } from "../dto/query-search.dto";
import { UpdateNotificationDto } from "../dto/update-notification.dto";
import { Notification } from "../entities/notification.entity";

export interface INotificationService {
    create(
        dto: CreateNotificationDto,
      ): Promise<ResData<Notification>>;
      findAll(query: QuerySearchDto): Promise<
        ResData<{
          items: Notification[];
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        }>
      >;
      findOneById(id: string): Promise<ResData<Notification>>;
      delete(id: string): Promise<ResData<Notification>>;
}