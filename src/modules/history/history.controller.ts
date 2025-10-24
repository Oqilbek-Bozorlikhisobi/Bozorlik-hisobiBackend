import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  Req,
} from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { IHistoryService } from './interfaces/history.service';
import { ApiQuery } from '@nestjs/swagger';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { Request } from 'express';
import { QuerySearchDto } from './dto/query-search.dto';

@Controller('history')
export class HistoryController {
  constructor(
    @Inject('IHistoryService') private readonly historyService: IHistoryService,
  ) {}

  @Auth(RoleEnum.USER)
  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Auth(RoleEnum.USER)
  @Get()
  @ApiQuery({ name: 'marketTypeId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAllUserHistoriesById(@Req() req: Request, @Query() query: QuerySearchDto) {
    const payload: any = req?.user;
    return this.historyService.getAllUserHistoriesById(payload.id, query);
  }

  @ApiQuery({ name: 'marketTypeId', required: true })
  @Auth(RoleEnum.USER)
  @Get('statistics')
  @ApiQuery({ name: 'marketTypeId', required: true })
  getUserStatistics(@Req() req: Request, @Query('marketTypeId') marketTypeId: string){
    const payload: any = req?.user;
    return this.historyService.getUserStatistics(payload.id, marketTypeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOneById(id);
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
