import { ResData } from "../../../common/lib/resData";
import { CreateAdminDto } from "../dto/create-admin.dto";
import { UpdateAdminDto } from "../dto/update-admin.dto";
import { Admin } from "../entities/admin.entity";

export interface IAdminService {
  findAll(): Promise<ResData<Array<Admin>>>;
  findOneById(id: string): Promise<ResData<Admin>>;
  create(data: CreateAdminDto): Promise<ResData<Admin>>;
  update(id: string, updateUserDto: UpdateAdminDto): Promise<ResData<Admin>>;
  delete(id: string): Promise<ResData<Admin>>;
}

