import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { IMarketService } from './interfaces/market.service';
import { AddUserDto } from './dto/add-user.dto';

@Controller('market')
export class MarketController {
  constructor(
    @Inject('IMarketService') private readonly marketService: IMarketService,
  ) {}

  @Post()
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.create(createMarketDto);
  }

  @Get()
  findAll() {
    return this.marketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @Patch('add/user')
  addUser(@Body() addUserDto: AddUserDto){
    return this.marketService.addUser(addUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.delete(id);
  }
}
