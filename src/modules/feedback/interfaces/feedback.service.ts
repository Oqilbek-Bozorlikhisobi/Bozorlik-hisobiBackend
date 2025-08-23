import { ResData } from '../../../common/lib/resData';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';

export interface IFeedbackService {
  create(dto: CreateFeedbackDto): Promise<ResData<Feedback>>;
  findAll(): Promise<
    ResData<{
      items: Feedback[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
}
