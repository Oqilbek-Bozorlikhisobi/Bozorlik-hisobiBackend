import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationService } from './interfaces/notification.service';
import { ApiQuery } from '@nestjs/swagger';
import { QuerySearchDto } from './dto/query-search.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.notificationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
