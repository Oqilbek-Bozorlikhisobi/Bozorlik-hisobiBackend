import { Injectable } from '@nestjs/common';
import { CreateMarketListDto } from './dto/create-market_list.dto';
import { UpdateMarketListDto } from './dto/update-market_list.dto';

@Injectable()
export class MarketListService {
  create(createMarketListDto: CreateMarketListDto) {
    return 'This action adds a new marketList';
  }

  findAll() {
    return `This action returns all marketList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketList`;
  }

  update(id: number, updateMarketListDto: UpdateMarketListDto) {
    return `This action updates a #${id} marketList`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketList`;
  }
}
