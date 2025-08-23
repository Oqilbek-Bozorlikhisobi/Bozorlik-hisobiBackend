import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedBackRepository } from './feedback.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UserModule],
  controllers: [FeedbackController],
  providers: [
    { provide: 'IFeedbackService', useClass: FeedbackService },
    { provide: 'IFeedbackRepository', useClass: FeedBackRepository },
  ],
  exports: [
    { provide: 'IFeedbackService', useClass: FeedbackService },
    { provide: 'IFeedbackRepository', useClass: FeedBackRepository },
  ],
})
export class FeedbackModule {}
