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
import { MarketTypeService } from './market_type.service';
import { CreateMarketTypeDto } from './dto/create-market_type.dto';
import { UpdateMarketTypeDto } from './dto/update-market_type.dto';
import { IMarketTypeService } from './interfaces/market_type.service';
import { ApiQuery } from '@nestjs/swagger';
import { QuerySearchDto } from './dto/query-search.dto';

@Controller('market-type')
export class MarketTypeController {
  constructor(
    @Inject('IMarketTypeService')
    private readonly marketTypeService: IMarketTypeService,
  ) {}

  @Post()
  create(@Body() createMarketTypeDto: CreateMarketTypeDto) {
    return this.marketTypeService.create(createMarketTypeDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.marketTypeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketTypeService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketTypeDto: UpdateMarketTypeDto,
  ) {
    return this.marketTypeService.update(id, updateMarketTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketTypeService.delete(id);
  }
}
