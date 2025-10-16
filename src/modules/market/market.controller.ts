import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UseGuards, Req } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { IMarketService } from './interfaces/market.service';
import { AddUserDto } from './dto/add-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CreateMarketByHistoryIdDto } from './dto/create-market-by-historyid.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { SelfGuard } from '../shared/guards/self.guard';
import { Request } from 'express';
import { RespondToInviteDto } from './dto/respond-to-invite.dto';

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
  @ApiQuery({
    name: 'marketTypeId',
    required: false,
    type: String,
    description: 'Filtrlash uchun MarketType ID (ixtiyoriy)',
  })
  findAll(@Req() req: Request, @Query('marketTypeId') marketTypeId?: string) {
    const payload: any = req?.user;
    return this.marketService.findAll(payload?.id, marketTypeId);
  }

  @Auth(RoleEnum.USER)
  @Get('current')
  getCurrentMarket(@Req() req: Request) {
    const payload: any = req?.user;
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
  @Patch('do-current/:id')
  doMarketIsCurrent(@Param('id') id: string, @Req() req: Request) {
    const payload: any = req?.user;
    return this.marketService.doMarketIsCurrent(id, payload?.id);
  }

  @Auth(RoleEnum.USER)
  @Patch('send/invitation')
  sendMarketInvitation(@Body() addUserDto: AddUserDto) {
    return this.marketService.sendMarketInvitation(addUserDto);
  }

  @Auth(RoleEnum.USER)
  @Patch('respond/to-invite')
  respondToInvite(
    @Req() req: Request,
    @Body() dto: RespondToInviteDto,
  ) {
    const payload: any = req?.user;
    return this.marketService.respondToInvite(payload?.id, dto);
  }

  @Auth(RoleEnum.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.delete(id);
  }
}
