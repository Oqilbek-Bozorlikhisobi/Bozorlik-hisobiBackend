import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { IHistoryService } from './interfaces/history.service';
import { ApiQuery } from '@nestjs/swagger';
import { GetHistoryByUserIdDto } from './dto/get-history-by-user-id.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { SelfGuard } from '../shared/guards/self.guard';

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

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  @ApiQuery({ name: 'userId', required: true })
  getAllUserHistoriesById(@Query() dto: GetHistoryByUserIdDto) {
    return this.historyService.getAllUserHistoriesById(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOneById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
  //   return this.historyService.update(id, updateHistoryDto);
  // }

  @Auth(RoleEnum.ADMIN, RoleEnum.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
