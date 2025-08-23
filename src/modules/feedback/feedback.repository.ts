import { InjectRepository } from '@nestjs/typeorm';
import { IFeedbackRepository } from './interfaces/feedback.repository';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';

export class FeedBackRepository implements IFeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(dto: Feedback): Promise<Feedback> {
    const newFeedback = await this.feedbackRepository.save(dto);
    return newFeedback;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{
    data: Feedback[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .orderBy('feedback.createdAt', 'DESC');

    if (limit) {
      query.skip(((page ?? 1) - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page: page ?? 1,
      limit: limit ?? total, // limit bo‘lmasa hammasini qaytaramiz
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }
}
