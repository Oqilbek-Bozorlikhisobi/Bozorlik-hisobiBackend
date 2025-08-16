import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { IMarketService } from './interfaces/market.service';
import { IMarketRepository } from './interfaces/market.repository';
import { ResData } from '../../common/lib/resData';
import { Market } from './entities/market.entity';
import { IUserRepository } from '../user/interfaces/user.repository';
import { UserAlreadyExists, UserNotFound } from '../user/exeptions/user.esxeption';
import { MarketNotFoundException } from './exeptions/market.exeption';
import { AddUserDto } from './dto/add-user.dto';
import { GetMarketByUserIdDto } from './dto/get-market-by-user-id.dto';

@Injectable()
export class MarketService implements IMarketService {
  constructor(
    @Inject('IMarketRepository')
    private readonly marketRepository: IMarketRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateMarketDto): Promise<ResData<Market>> {
    const user = await this.userRepository.findOneById(dto.userId)
    if (!user) {
      throw new UserNotFound()
    }
    const newMarket = new Market()
    Object.assign(newMarket, dto)
    newMarket.users = [user]

    const data = await this.marketRepository.create(newMarket)

    return new ResData<Market>('Market created successfully', 201, data)
  }

  async findAll(dto: GetMarketByUserIdDto): Promise<ResData<Array<Market>>> {
    const data = await this.marketRepository.findAll(dto.search)
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
      const user = await this.userRepository.findOneById(dto.userId)
      if (!user) {
        throw new UserNotFound()
      }
      foundData.users = [user]
    }
    Object.assign(foundData, dto);
    const data = await this.marketRepository.update(foundData);
    return new ResData<Market>('ok', 200, data);
  }

  async addUser(addUserDto: AddUserDto): Promise<ResData<Market>> {
    const user = await this.userRepository.findByPhoneNumber(addUserDto.phoneNumber)
    if (!user) {
      throw new UserNotFound()
    }
    const market = await this.marketRepository.findById(addUserDto.marketId)
    if (!market) {
      throw new MarketNotFoundException()
    }
    const alreadyExists = market.users.some((u) => u.id === user.id);
    if (!alreadyExists) {
      market.users.push(user);
    }else {
      throw new UserAlreadyExists()
    }
    const data = await this.marketRepository.update(market)
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
}
