import { ResData } from "../../../common/lib/resData";
import { CreateFeedbackDto } from "../dto/create-feedback.dto";
import { Feedback } from "../entities/feedback.entity";

export interface IFeedbackRepository {
    create(dto: Feedback): Promise<Feedback>
    findAll(): Promise<{
        data: Feedback[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>;
}