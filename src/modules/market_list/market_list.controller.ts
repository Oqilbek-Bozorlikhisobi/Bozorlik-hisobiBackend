import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { MarketListService } from './market_list.service';
import { CreateMarketListDto } from './dto/create-market_list.dto';
import { UpdateMarketListDto } from './dto/update-market_list.dto';
import { IMarketListService } from './interfaces/market-list.service';
import { CheckListDto } from './dto/check-list.dto';

@Controller('market-list')
export class MarketListController {
  constructor(
    @Inject('IMarketListService')
    private readonly marketListService: IMarketListService,
  ) {}

  @Post()
  create(@Body() createMarketListDto: CreateMarketListDto) {
    return this.marketListService.create(createMarketListDto);
  }

  @Get()
  findAll() {
    return this.marketListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketListService.findOneById(id);
  }

  @Patch('check-is-buying/:id')
  checkMarketListIsBuying(
    @Param('id') id: string,
    @Body() dto: CheckListDto,
  ) {
    return this.marketListService.checkMarketListIsBuying(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketListService.delete(id);
  }
}
