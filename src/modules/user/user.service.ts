import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service';
import { IUserRepository } from './interfaces/user.repository';
import { ResData } from '../../common/lib/resData';
import { User } from './entities/user.entity';
import {
  PasswordOrconfirmPassowrdDidntExists,
  PassworsDontMatch,
  UserAlreadyExists,
  UserNotFound,
} from './exeptions/user.esxeption';
import { hash } from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async create(data: CreateUserDto): Promise<ResData<User>> {
    const candidate = await this.userRepository.findByPhoneNumber(
      data.phoneNumber,
    );
    if (candidate) {
      throw new UserAlreadyExists();
    }

    if (data.password !== data.confirmPassword) {
      throw new PassworsDontMatch();
    }

    const hashedPassword = await hash(data.password, 7);
    const newUser = new User();
    newUser.fullName = data.fullName;
    newUser.region = data.region;
    newUser.gender = data.gender;
    newUser.phoneNumber = data.phoneNumber;
    newUser.hashedPassword = hashedPassword;
    const newData = await this.userRepository.create(newUser);
    return new ResData<User>('User register successfully', 201, newData);
  }

  async findAll(): Promise<ResData<Array<User>>> {
    const data = await this.userRepository.findAll();
    return new ResData<Array<User>>('Success', 200, data);
  }

  async findOneById(id: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    return new ResData<User>('Success', 200, foundData);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!foundData) {
      throw new UserNotFound();
    }
    return new ResData<User>('Success', 200, foundData);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    if (updateUserDto.phoneNumber) {
      const condidate = await this.userRepository.findByPhoneNumber(
        updateUserDto.phoneNumber,
      );
      if (condidate && condidate.id !== id) {
        throw new UserAlreadyExists();
      }
      foundData.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      if (!updateUserDto.password || !updateUserDto.confirmPassword) {
        throw new PasswordOrconfirmPassowrdDidntExists();
      }

      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new PassworsDontMatch();
      }

      const hashedPassword = await hash(updateUserDto.password, 7);
      foundData.hashedPassword = hashedPassword;
    }
    Object.assign(foundData, updateUserDto);
    const newData = await this.userRepository.update(foundData)
    return new ResData<User>('Success', 200, newData);
  }

  async delete(id: string): Promise<ResData<User>> {
    const foundData = await this.userRepository.findOneById(id);
    if (!foundData) {
      throw new UserNotFound();
    }
    const newData = await this.userRepository.delete(foundData);
    return new ResData<User>('Success', 200, newData);
  }
}
