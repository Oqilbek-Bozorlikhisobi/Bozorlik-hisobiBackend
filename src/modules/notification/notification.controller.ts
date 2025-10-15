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
  Req,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationService } from './interfaces/notification.service';
import { ApiQuery } from '@nestjs/swagger';
import { QuerySearchDto } from './dto/query-search.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  @Auth(RoleEnum.ADMIN)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Get('admin')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAllForAdmin(@Query() query: QuerySearchDto) {
    return this.notificationService.findAllForAdmin(query);
  }

  @Auth(RoleEnum.USER)
  @Get('user')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAllForUser(@Query() query: QuerySearchDto, @Req() req: Request) {
    const payload: any = req?.user;
    const userId = payload?.id;
    return this.notificationService.findAllForUser(userId, query);
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOneById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @Patch(':id/make-global')
  makeGlobal(@Param('id') id: string) {
    return this.notificationService.makeGlobal(id);
  }

  @Auth(RoleEnum.USER)
  @Patch('do-all-read')
  doAllIsRead(@Req() req: Request) {
    const payload: any = req?.user;
    const userId = payload?.id;
    return this.notificationService.doAllIsRead(userId);
  }

  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Auth(RoleEnum.USER)
  @Delete('clear-all')
  clearAllNotifications(@Req() req: Request) {
    const payload: any = req?.user;
    const userId = payload?.id;
    return this.notificationService.clearAllNotifications(userId);
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
