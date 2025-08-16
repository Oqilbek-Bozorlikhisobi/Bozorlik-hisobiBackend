import { ResData } from "../../../common/lib/resData";
import { ChangePhoneNumberDto } from "../../auth/dto/change-phone-number.dto";
import { SendOtpAgainDto } from "../../auth/dto/send-otp-again.dto";
import { VerifyOtpDto } from "../../auth/dto/verify-otp.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { QuerySearchDto } from "../dto/query-search.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface IUserService {
  findAll(query: QuerySearchDto): Promise<ResData<Array<User>>>;
  findOneById(id: string): Promise<ResData<User>>;
  findByPhoneNumber(phoneNumber: string): Promise<ResData<User>>;
  create(data: CreateUserDto): Promise<ResData<User>>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<ResData<User>>;
  changePhoneNumber(
    id: string,
    changePhoneNumberDto: ChangePhoneNumberDto,
  ): Promise<ResData<{ user_id: string; details: string }>>;
  verifyOtpForChangePhoneNumber(id:string, verifyOtpDto:VerifyOtpDto): Promise<ResData<User>>;
  sendOtpAgainForChangePhoneNumber(id:string, sendOtpAgainDto:SendOtpAgainDto) : Promise<ResData<{user_id:string, details:string, otp:string}>>;
  delete(id: string): Promise<ResData<User>>;
}

