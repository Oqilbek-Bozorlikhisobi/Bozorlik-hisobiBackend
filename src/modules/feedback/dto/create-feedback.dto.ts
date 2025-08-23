import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackTypeEnum } from '../../../common/enums/enum';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Text of feedback',
    example: 'This is a feedback',
  })
  @IsString()
  text: string;

  //   @ApiProperty({
  //     description: 'Type of feedback',
  //     example: FeedbackTypeEnum.BUG,
  //     enum: FeedbackTypeEnum,
  //     default: FeedbackTypeEnum.SUGGESTION,
  //   })
  //   @IsEnum(FeedbackTypeEnum)
  //   type: FeedbackTypeEnum;

  @IsOptional()
  userId: string;
}
