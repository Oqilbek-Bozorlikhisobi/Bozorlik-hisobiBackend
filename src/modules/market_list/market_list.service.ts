import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketListDto } from './dto/create-market_list.dto';
import { UpdateMarketListDto } from './dto/update-market_list.dto';
import { IMarketListRepository } from './interfaces/market-list.repository';
import { IMarketRepository } from '../market/interfaces/market.repository';
import { IProductsRepository } from '../products/interfaces/products.repository';
import { IUserRepository } from '../user/interfaces/user.repository';
import { IMarketListService } from './interfaces/market-list.service';
import { ResData } from '../../common/lib/resData';
import { MarketList } from './entities/market_list.entity';
import { MarketNotFoundException } from '../market/exeptions/market.exeption';
import { ProductNotFoundExeption } from '../products/exeptions/products.exeption';
import { MarketListNotFoundExeption } from './exetions/market-list.exeption';
import { CheckListDto } from './dto/check-list.dto';
import { UserNotFound } from '../user/exeptions/user.esxeption';

@Injectable()
export class MarketListService implements IMarketListService {
  constructor(
    @Inject('IMarketListRepository')
    private readonly marketListRepository: IMarketListRepository,
    @Inject('IMarketRepository')
    private readonly marketRepository: IMarketRepository,
    @Inject('IProductsRepository')
    private readonly productRepository: IProductsRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateMarketListDto): Promise<ResData<MarketList>> {
    const checkMarket = await this.marketRepository.findById(dto.marketId);
    if (!checkMarket) {
      throw new MarketNotFoundException();
    }
    const newMarketList = new MarketList();
    Object.assign(newMarketList, dto);
    newMarketList.market = checkMarket;

    if (dto.productId) {
      const checkProduct = await this.productRepository.findById(dto.productId);
      if (!checkProduct) {
        throw new ProductNotFoundExeption();
      }
      newMarketList.product = checkProduct;
    } else {
      newMarketList.product = null;
    }

    const data = await this.marketListRepository.create(newMarketList);
    return new ResData<MarketList>(
      'MarketList created successfully',
      201,
      data,
    );
  }

  async findAll(): Promise<ResData<MarketList[]>> {
    const data = await this.marketListRepository.findAll();
    return new ResData<MarketList[]>('ok', 200, data);
  }

  async findOneById(id: string): Promise<ResData<MarketList>> {
    const foundData = await this.marketListRepository.findById(id);
    if (!foundData) {
      throw new MarketListNotFoundExeption();
    }
    return new ResData<MarketList>('ok', 200, foundData);
  }

  async checkMarketListIsBuying(id: string, dto: CheckListDto): Promise<ResData<MarketList>> {
    const foundData = await this.marketListRepository.findById(id);
    if (!foundData) {
      throw new MarketListNotFoundExeption();
    }
    const checkUser = await this.userRepository.findOneById(dto.userId);
    if (!checkUser) {
      throw new UserNotFound();
    }
    foundData.isBuying = true;
    foundData.user = checkUser;
    foundData.price = dto.price;
    const data = await this.marketListRepository.update(foundData);
    return new ResData<MarketList>('ok', 200, data);
  }

  async delete(id: string): Promise<ResData<MarketList>> {
    const foundData = await this.marketListRepository.findById(id);
    if (!foundData) {
      throw new MarketListNotFoundExeption();
    }
    await this.marketListRepository.delete(foundData);
    return new ResData<MarketList>(
      'MarketList deleted successfully',
      200,
      foundData,
    );
  }
}
