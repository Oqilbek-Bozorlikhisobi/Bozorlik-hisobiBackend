import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { IMarketService } from './interfaces/market.service';
import { IMarketRepository } from './interfaces/market.repository';
import { ResData } from '../../common/lib/resData';
import { Market } from './entities/market.entity';
import { IUserRepository } from '../user/interfaces/user.repository';
import {
  UserAlreadyExists,
  UserNotFound,
} from '../user/exeptions/user.esxeption';
import { MarketNotFoundException } from './exeptions/market.exeption';
import { AddUserDto } from './dto/add-user.dto';
import { GetMarketByUserIdDto } from './dto/get-market-by-user-id.dto';
import { IHistoryRepository } from '../history/interfaces/history.repository';
import { HistoryNotFoundException } from '../history/exeptions/history.exeption';
import { CreateMarketByHistoryIdDto } from './dto/create-market-by-historyid.dto';
import { MarketList } from '../market_list/entities/market_list.entity';

@Injectable()
export class MarketService implements IMarketService {
  constructor(
    @Inject('IMarketRepository')
    private readonly marketRepository: IMarketRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async create(dto: CreateMarketDto): Promise<ResData<Market>> {
    const user = await this.userRepository.findOneById(dto.userId);
    if (!user) {
      throw new UserNotFound();
    }
    const newMarket = new Market();
    Object.assign(newMarket, dto);
    newMarket.users = [user];

    const data = await this.marketRepository.create(newMarket);

    return new ResData<Market>('Market created successfully', 201, data);
  }

  async findAll(dto: GetMarketByUserIdDto): Promise<ResData<Array<Market>>> {
    const data = await this.marketRepository.findAll(dto.search);
    data.forEach(async (market) => {
      if (market.marketLists && market.marketLists.length > 0) {
        // Hamma isBuying true bo‘lsa
        const allBought = market.marketLists.every(
          (marketList) => marketList.isBuying === true,
        );
        market.isAllBuy = allBought;

        // Faqat isBuying = true bo‘lganlarni total price hisoblash
        const totalPrice = market.marketLists
          .filter((ml) => ml.isBuying)
          .reduce((sum, ml) => {
            const price = Number(ml.price ?? 0);
            const quantity = Number(ml.quantity ?? 1);
            return sum + price * quantity;
          }, 0);

        // DBda yo‘q bo‘lsa response uchun qo‘shib qo‘yish
        (market as any).totalPrice = totalPrice;
      } else {
        market.isAllBuy = false;
        (market as any).totalPrice = 0;
      }
      await this.marketRepository.update(market);
    });
    return new ResData<Array<Market>>('ok', 200, data);
  }

  async findOneById(id: string): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }
    return new ResData<Market>('ok', 200, foundData);
  }

  async update(id: string, dto: UpdateMarketDto): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }
    if (dto.userId) {
      const user = await this.userRepository.findOneById(dto.userId);
      if (!user) {
        throw new UserNotFound();
      }
      foundData.users = [user];
    }
    Object.assign(foundData, dto);
    const data = await this.marketRepository.update(foundData);
    return new ResData<Market>('ok', 200, data);
  }

  async addUser(addUserDto: AddUserDto): Promise<ResData<Market>> {
    const user = await this.userRepository.findByPhoneNumber(
      addUserDto.phoneNumber,
    );
    if (!user) {
      throw new UserNotFound();
    }
    const market = await this.marketRepository.findById(addUserDto.marketId);
    if (!market) {
      throw new MarketNotFoundException();
    }
    const alreadyExists = market.users.some((u) => u.id === user.id);
    if (!alreadyExists) {
      market.users.push(user);
    } else {
      throw new UserAlreadyExists();
    }
    const data = await this.marketRepository.update(market);
    return new ResData<Market>('ok', 200, data);
  }

  async delete(id: string): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }
    const data = await this.marketRepository.delete(foundData);
    return new ResData<Market>('ok', 200, data);
  }

  // async createMarketByHistoryId(dto: CreateMarketByHistoryIdDto): Promise<ResData<Market>> {
  //   const history = await this.historyRepository.findById(dto.historyId)
  //   if(!history){
  //     throw new HistoryNotFoundException()
  //   }
  //   const checkUser = await this.userRepository.findOneById(dto.userId)
  //   if(!checkUser){
  //     throw new UserNotFound()
  //   }
  //   const newMarket = new Market()
  //   newMarket.name = history.name
  //   newMarket.users = [checkUser]
  //   const data = await this.marketRepository.create(newMarket)

  //   if (history.marketLists && Array.isArray(history.marketLists)){
  //     const newMarketLists = history.marketLists.map((ml) => {
  //       const newMl = new MarketList()
  //       newMl.market = data
  //       newMl.product = ml?.product
  //       newMl.productName = ml?.productName
  //       newMl.productType = ml?.productType
  //       newMl.quantity = ml?.quantity
  //       await this.marketLis
  //     })

  //   }
  // }
}
