import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IAdminRepository } from './interfaces/admin.repository';
import { IAdminService } from './interfaces/admin.service';
import { ResData } from '../../common/lib/resData';
import { Admin } from './entities/admin.entity';
import {
  AdminAlreadyExists,
  AdminNotFound,
  PasswordOrconfirmPassowrdDidntExists,
  PassworsDontMatch,
} from './exeptions/admin.exeption';
import { hash } from 'bcrypt';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async create(data: CreateAdminDto): Promise<ResData<Admin>> {
    const candidate = await this.adminRepository.findByLogin(data.login);
    if (candidate) {
      throw new AdminAlreadyExists();
    }

    if (data.password !== data.confirmPassword) {
      throw new PassworsDontMatch();
    }

    const hashedPassword = await hash(data.password, 7);
    const newAdmin = new Admin();
    newAdmin.login = data.login;
    newAdmin.hashedPassword = hashedPassword;
    const newData = await this.adminRepository.create(newAdmin);
    return new ResData<Admin>('User register successfully', 201, newData);
  }

  async findAll(): Promise<ResData<Array<Admin>>> {
    const data = await this.adminRepository.findAll()
    return new ResData<Array<Admin>>('Success', 200, data);
  }

  async findOneById(id: string): Promise<ResData<Admin>> {
    const foundData = await this.adminRepository.findOneById(id)
    if (!foundData) {
      throw new AdminNotFound()
    }
    return new ResData<Admin>('Success', 200, foundData);
  }

  async update(id: string, updateUserDto: UpdateAdminDto): Promise<ResData<Admin>> {
    const foundData = await this.adminRepository.findOneById(id);
    if (!foundData) {
      throw new AdminNotFound();
    }
    if (updateUserDto.login) {
      const candidate = await this.adminRepository.findByLogin(updateUserDto.login)
      if (candidate && candidate.id !== id) {
        throw new AdminAlreadyExists();
      }
      foundData.login = updateUserDto.login;
    }
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      if (!updateUserDto.password || !updateUserDto.confirmPassword) {
        throw new PasswordOrconfirmPassowrdDidntExists()
      }

      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new PassworsDontMatch();
      }

      const hashedPassword = await hash(updateUserDto.password, 7);
      foundData.hashedPassword = hashedPassword;
    }
    const newData = await this.adminRepository.update(foundData);
    return new ResData<Admin>('Success', 200, newData);

  }

  async delete(id: string): Promise<ResData<Admin>> {
    const foundData = await this.adminRepository.findOneById(id);
    if (!foundData) {
      throw new AdminNotFound();
    }
    const newData = await this.adminRepository.delete(foundData);
    return new ResData<Admin>('Success', 200, newData);
  }
}
