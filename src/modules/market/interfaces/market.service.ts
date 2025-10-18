import { ResData } from '../../../common/lib/resData';
import { AddUserDto } from '../dto/add-user.dto';
import { CreateMarketByHistoryIdDto } from '../dto/create-market-by-historyid.dto';
import { CreateMarketDto } from '../dto/create-market.dto';
import { DeletedUserDto } from '../dto/deleted-user.dto';
import { GetMarketByUserIdDto } from '../dto/get-market-by-user-id.dto';
import { RespondToInviteDto } from '../dto/respond-to-invite.dto';
import { UpdateMarketDto } from '../dto/update-market.dto';
import { Market } from '../entities/market.entity';

export interface IMarketService {
  create(dto: CreateMarketDto): Promise<ResData<Market>>;
  findAll(id: string, marketTypeId?: string): Promise<ResData<Array<Market>>>;
  findOneById(id: string): Promise<ResData<Market>>;
  update(id: string, dto: UpdateMarketDto): Promise<ResData<Market>>;
  sendMarketInvitation(addUserDto: AddUserDto): Promise<ResData<Market>>;
  delete(id: string): Promise<ResData<Market>>;
  createMarketByHistoryId(
    dto: CreateMarketByHistoryIdDto,
  ): Promise<ResData<Market>>;
  getCurrentMarket(userId: string): Promise<ResData<Market>>;
  doMarketIsCurrent(id: string, userId: string): Promise<ResData<Market>>;
  respondToInvite(userId:string, dto: RespondToInviteDto): Promise<ResData<Market>>;
  deleteUser(userId: string, dto: DeletedUserDto): Promise<ResData<Market>>;
}
