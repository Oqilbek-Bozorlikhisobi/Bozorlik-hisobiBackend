import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
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
import {
  MarketNotFoundException,
  OfferNotFoundException,
} from './exeptions/market.exeption';
import { AddUserDto } from './dto/add-user.dto';
import { GetMarketByUserIdDto } from './dto/get-market-by-user-id.dto';
import { IHistoryRepository } from '../history/interfaces/history.repository';
import { HistoryNotFoundException } from '../history/exeptions/history.exeption';
import { CreateMarketByHistoryIdDto } from './dto/create-market-by-historyid.dto';
import { MarketList } from '../market_list/entities/market_list.entity';
import { IMarketListRepository } from '../market_list/interfaces/market-list.repository';
import { IProductsRepository } from '../products/interfaces/products.repository';
import { IUnitRepository } from '../unit/interfaces/unit.reposotory';
import { IMarketTypeRepository } from '../market_type/interfaces/market_type.repository';
import { INotificationRepository } from '../notification/interfaces/notification.repository';
import { MarketTypeNotFoundExeption } from '../market_type/exeptions/market_type.exeption';
import { RespondToInviteDto } from './dto/respond-to-invite.dto';
import { DeletedUserDto } from './dto/deleted-user.dto';
import { CalculationType } from '../../common/enums/enum';

@Injectable()
export class MarketService implements IMarketService {
  constructor(
    @Inject('IMarketRepository')
    private readonly marketRepository: IMarketRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    @Inject('IMarketListRepository')
    private readonly marketListRepository: IMarketListRepository,
    @Inject('IUnitRepository')
    private readonly unitRepository: IUnitRepository,
    @Inject('IProductsRepository')
    private readonly productRepository: IProductsRepository,
    @Inject('IMarketTypeRepository')
    private readonly marketTypeRepository: IMarketTypeRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  private async calculateMarket(market: Market): Promise<Market> {
    if (market.marketLists && market.marketLists.length > 0) {
      const allBought = market.marketLists.every((ml) => ml.isBuying);
      market.isAllBuy = allBought;

      const totalPrice = market.marketLists
        .filter((ml) => ml.isBuying)
        .reduce((sum, ml) => {
          const price = Number(ml.price ?? 0);
          const quantity = Number(ml.quantity ?? 1);
          if (ml.calculationType === CalculationType.ONE) {
            return sum + price * quantity; // ONE bo‘lsa price * quantity
          } else if (ml.calculationType === CalculationType.ALL) {
            return sum + price; // ALL bo‘lsa faqat price olinadi
          }
          return sum;
        }, 0);

      (market as any).totalPrice = totalPrice;
    } else {
      market.isAllBuy = false;
      (market as any).totalPrice = 0;
    }

    await this.marketRepository.update(market);
    return market;
  }

  async create(dto: CreateMarketDto): Promise<ResData<Market>> {
    const user = await this.userRepository.findOneById(dto.userId);
    if (!user) {
      throw new UserNotFound();
    }

    const marketType = await this.marketTypeRepository.findById(
      dto.marketTypeId,
    );
    if (!marketType) {
      throw new MarketTypeNotFoundExeption();
    }

    // Avval shu userga tegishli barcha marketlarni olib kelamiz
    const markets = await this.marketRepository.findAll(dto.userId);
    for (const market of markets) {
      if (market.isCurrent) {
        market.isCurrent = false;
        await this.marketRepository.update(market);
      }
    }

    // Yangi market yaratamiz va uni current qilamiz
    const newMarket = new Market();
    Object.assign(newMarket, dto);
    newMarket.users = [user];
    newMarket.marketType = marketType;
    newMarket.marketCreator = dto.userId;
    newMarket.isCurrent = true;

    const data = await this.marketRepository.create(newMarket);

    return new ResData<Market>('Market created successfully', 201, data);
  }

  async findAll(
    id: string,
    marketTypeId?: string,
  ): Promise<ResData<Array<Market>>> {
    const data = await this.marketRepository.findAll(id, marketTypeId);

    const calculated = await Promise.all(
      data.map((market) => this.calculateMarket(market)),
    );

    return new ResData<Array<Market>>('ok', 200, calculated);
  }

  async findOneById(id: string): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }

    return new ResData<Market>(
      'ok',
      200,
      await this.calculateMarket(foundData),
    );
  }

  async update(id: string, dto: UpdateMarketDto): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }
    if (dto.marketTypeId) {
      const marketType = await this.marketTypeRepository.findById(
        dto.marketTypeId,
      );
      if (!marketType) {
        throw new MarketNotFoundException();
      }
      foundData.marketType = marketType;
    }
    Object.assign(foundData, dto);
    const data = await this.marketRepository.update(foundData);
    return new ResData<Market>('ok', 200, data);
  }

  async sendMarketInvitation(
    userId: string,
    addUserDto: AddUserDto,
  ): Promise<ResData<Market>> {
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

    if (userId !== market.marketCreator) {
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    }

    const alreadyExists = market.users?.some((u) => u.id === user.id) ?? false;
    if (alreadyExists) throw new UserAlreadyExists();

    const userAlreadyPending =
      market.pendingUsers?.some((u) => u.id === user.id) ?? false;
    if (userAlreadyPending) {
      return new ResData<Market>(
        'User already invited to this market',
        200,
        market,
      );
    }

    const pendingUser = {
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      createdAt: new Date(),
    };

    if (!market.pendingUsers) market.pendingUsers = [];
    market.pendingUsers.push(pendingUser);

    const data = await this.marketRepository.update(market);

    const creator = await this.userRepository.findOneById(market.marketCreator);

    await this.notificationRepository.create({
      isSent: true,
      sender: creator,
      market: market,
      receiver: user,
      isRead: false,
      note: addUserDto.note,
      isGlobal: false,
    });

    return new ResData<Market>('ok', 200, data);
  }

  async respondToInvite(
    userId: string,
    dto: RespondToInviteDto,
  ): Promise<ResData<Market>> {
    const market = await this.marketRepository.findById(dto.marketId);
    if (!market) {
      throw new MarketNotFoundException();
    }
    const pending = market.pendingUsers || [];
    const target = pending.find((u) => u.id === userId);
    if (!target) throw new OfferNotFoundException();

    if (dto.accept) {
      const user = await this.userRepository.findOneById(userId);
      if (!user) {
        throw new UserNotFound();
      }
      market.users.push(user);
    }

    market.pendingUsers = pending.filter((u) => u.id !== userId);
    await this.marketRepository.update(market);
    return new ResData(
      `Taklif ${dto.accept ? 'qabul qilindi' : 'rad etildi'}`,
      200,
      market,
    );
  }

  async deleteUser(
    userId: string,
    dto: DeletedUserDto,
  ): Promise<ResData<Market>> {
    const market = await this.marketRepository.findById(dto.marketId);
    if (!market) {
      throw new MarketNotFoundException();
    }
    if (market.marketCreator !== userId) {
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    }

    if (dto.deletedUserId === userId) {
      throw new ForbiddenException('Siz o‘zingizni o‘chira olmaysiz');
    }

    const user = await this.userRepository.findOneById(dto.deletedUserId);
    if (!user) {
      throw new UserNotFound();
    }
    market.users = market.users.filter((u) => u.id !== dto.deletedUserId);
    await this.marketRepository.update(market);
    return new ResData('ok', 200, market);
  }

  async delete(id: string): Promise<ResData<Market>> {
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }
    const data = await this.marketRepository.delete(foundData);
    return new ResData<Market>('ok', 200, data);
  }

  async createMarketByHistoryId(
    dto: CreateMarketByHistoryIdDto,
  ): Promise<ResData<Market>> {
    const history = await this.historyRepository.findById(dto.historyId);
    if (!history) {
      throw new HistoryNotFoundException();
    }
    const checkUser = await this.userRepository.findOneById(dto.userId);
    if (!checkUser) {
      throw new UserNotFound();
    }
    const newMarket = new Market();
    newMarket.name = history.name;
    newMarket.marketCreator = checkUser.id;
    newMarket.users = [checkUser];
    newMarket.marketType = history.marketType;

    const data = await this.marketRepository.create(newMarket);

    if (history.marketLists && Array.isArray(history.marketLists)) {
      await Promise.all(
        history.marketLists.map(async (ml) => {
          const newMl = new MarketList();
          newMl.market = data;

          if (ml.product) {
            const product = await this.productRepository.findById(
              ml.product.id,
            );
            if (product) {
              newMl.product = product;
              newMl.productName = ml.productName ?? product.titleUz;
            } else {
              newMl.product = null;
              newMl.productName = ml.product?.titleUz ?? ml.productName;
            }
          } else {
            newMl.product = null;
            newMl.productName = ml.productName ?? null;
          }

          // ✅ unitni tekshiramiz
          if (ml.unit) {
            const unit = await this.unitRepository.findById(ml.unit.id);
            newMl.unit = unit ?? null;
          } else {
            newMl.unit = null;
          }

          newMl.quantity = ml?.quantity;
          await this.marketListRepository.create(newMl);
        }),
      );
    }
    const updatedData = await this.marketRepository.findById(data.id);
    return new ResData<Market>('ok', 200, updatedData);
  }

  async getCurrentMarket(userId: string): Promise<ResData<Market>> {
    const currentMarket = await this.marketRepository.findByIsCurrent(userId);

    if (!currentMarket) {
      return new ResData<Market>('ok', 200, null);
    }

    return new ResData<Market>(
      'ok',
      200,
      await this.calculateMarket(currentMarket),
    );
  }

  async doMarketIsCurrent(
    id: string,
    userId: string,
  ): Promise<ResData<Market>> {
    // Market mavjudligini tekshiramiz
    const foundData = await this.marketRepository.findById(id);
    if (!foundData) {
      throw new MarketNotFoundException();
    }

    // Shu userga tegishli bo‘lgan barcha marketlarda isCurrent = false qilamiz
    const markets = await this.marketRepository.findAll(userId);
    for (const market of markets) {
      if (market.isCurrent) {
        market.isCurrent = false;
        await this.marketRepository.update(market);
      }
    }

    // Tanlangan marketni current qilamiz
    foundData.isCurrent = true;
    const updated = await this.marketRepository.update(foundData);

    return new ResData<Market>('Market set as current', 200, updated);
  }
}
