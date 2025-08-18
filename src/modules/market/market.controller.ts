import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { IMarketService } from './interfaces/market.service';
import { AddUserDto } from './dto/add-user.dto';
import { GetMarketByUserIdDto } from './dto/get-market-by-user-id.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CreateMarketByHistoryIdDto } from './dto/create-market-by-historyid.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { SelfGuard } from '../shared/guards/self.guard';

@Controller('market')
export class MarketController {
  constructor(
    @Inject('IMarketService') private readonly marketService: IMarketService,
  ) {}

  @Auth(RoleEnum.USER)
  @Post()
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.create(createMarketDto);
  }

  @Auth(RoleEnum.USER)
  @Post('create-by-history-id')
  createMarketByHistoryId(@Body() dto: CreateMarketByHistoryIdDto) {
    return this.marketService.createMarketByHistoryId(dto);
  }

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER)
  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() dto: GetMarketByUserIdDto) {
    return this.marketService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketService.findOneById(id);
  }

  @Auth(RoleEnum.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @Auth(RoleEnum.USER)
  @Patch('add/user')
  addUser(@Body() addUserDto: AddUserDto) {
    return this.marketService.addUser(addUserDto);
  }

  @Auth(RoleEnum.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.delete(id);
  }
}
