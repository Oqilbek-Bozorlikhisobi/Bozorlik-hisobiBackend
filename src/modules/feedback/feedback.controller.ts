import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { IFeedbackService } from './interfaces/feedback.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { Request } from 'express';

@Controller('feedback')
export class FeedbackController {
  constructor(
    @Inject('IFeedbackService')
    private readonly feedbackService: IFeedbackService,
  ) {}

  @Auth(RoleEnum.USER)
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: Request) {
    const payload: any = req?.user;
    createFeedbackDto.userId = payload.id;
    return this.feedbackService.create(createFeedbackDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }
}
