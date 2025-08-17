import { Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { IHistoryService } from './interfaces/history.service';
import { IHistoryRepository } from './interfaces/history.repository';
import { ResData } from '../../common/lib/resData';
import { History } from './entities/history.entity';
import { IMarketRepository } from '../market/interfaces/market.repository';
import { MarketNotFoundException } from '../market/exeptions/market.exeption';
import { AllNotBuyingExption, HistoryNotFoundException } from './exeptions/history.exeption';
import { GetHistoryByUserIdDto } from './dto/get-history-by-user-id.dto';

@Injectable()
export class HistoryService implements IHistoryService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    @Inject('IMarketRepository')
    private readonly marketRepository: IMarketRepository,
  ){}

  async create(dto: CreateHistoryDto): Promise<ResData<History>> {
    const market = await this.marketRepository.findById(dto.marketId)
    if(!market){
      throw new MarketNotFoundException()
    }
    if (!market.isAllBuy) {
      throw new AllNotBuyingExption()
    }
    const newHistory = new History()
    newHistory.name = market.name
    newHistory.marketLists = market.marketLists
    newHistory.users = market.users
    newHistory.totalPrice = market.totalPrice
    const data = await this.historyRepository.create(newHistory)
    await this.marketRepository.delete(market)
    return new ResData<History>('History created successfully', 201, data)
  }

  async getAllUserHistoriesById(dto: GetHistoryByUserIdDto): Promise<ResData<Array<History>>> {
    const data = await this.historyRepository.findAll(dto.userId)
    return new ResData<Array<History>>('ok', 200, data)
  }

  async findOneById(id: string): Promise<ResData<History>> {
    const foundData = await this.historyRepository.findById(id)
    if(!foundData){
      throw new HistoryNotFoundException()
    }
    return new ResData<History>('ok', 200, foundData)
  }

  async delete(id: string): Promise<ResData<History>> {
    const foundData = await this.historyRepository.findById(id);
    if (!foundData) {
      throw new HistoryNotFoundException();
    }
    await this.historyRepository.delete(foundData)
    return new ResData<History>('ok', 200, foundData);
  }
}
