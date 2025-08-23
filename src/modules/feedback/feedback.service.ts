import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { IFeedbackService } from './interfaces/feedback.service';
import { IFeedbackRepository } from './interfaces/feedback.repository';
import { ResData } from '../../common/lib/resData';
import { Feedback } from './entities/feedback.entity';
import { IUserRepository } from '../user/interfaces/user.repository';
import { UserNotFound } from '../user/exeptions/user.esxeption';

@Injectable()
export class FeedbackService implements IFeedbackService {
  constructor(
    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<ResData<Feedback>> {
    const user = await this.userRepository.findOneById(dto.userId);
    if (!user) {
      throw new UserNotFound();
    }
    const newFeedback = new Feedback();
    Object.assign(newFeedback, dto);
    newFeedback.user = user;
    const data = await this.feedbackRepository.create(newFeedback);
    return new ResData<Feedback>('Feedback created sucessfully', 201, data);
  }

  async findAll(): Promise<
    ResData<{
      items: Feedback[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  > {
    const data = await this.feedbackRepository.findAll();
    return new ResData('ok', 200, {
      items: data.data,
      page: data.page,
      limit: data.limit ?? 0, // null bo‘lsa 0
      total: data.total,
      totalPages: data.totalPages,
    });
  }
}
