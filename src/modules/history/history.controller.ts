import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { IHistoryService } from './interfaces/history.service';
import { ApiQuery } from '@nestjs/swagger';
import { GetHistoryByUserIdDto } from './dto/get-history-by-user-id.dto';

@Controller('history')
export class HistoryController {
  constructor(
    @Inject('IHistoryService') private readonly historyService: IHistoryService,
  ) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
