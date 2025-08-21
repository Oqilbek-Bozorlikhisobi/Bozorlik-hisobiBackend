import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UseGuards, Req } from '@nestjs/common';
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
import { Request } from 'express';

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

  @Auth(RoleEnum.USER)
  @Get()
  findAll(@Req() req: Request) {
    const payload:any = req?.user
    return this.marketService.findAll(payload?.id);
  }

  @Auth(RoleEnum.USER)
  @Get('current')
  getCurrentMarket(@Req() req: Request) {
    const payload:any = req?.user
    return this.marketService.getCurrentMarket(payload?.id);
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
