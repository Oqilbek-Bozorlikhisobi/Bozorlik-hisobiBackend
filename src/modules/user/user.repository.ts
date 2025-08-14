import { InjectRepository } from "@nestjs/typeorm";
import { IUserRepository } from "./interfaces/user.repository";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){}

    async create(entity: User): Promise<User> {
        const newUser = await this.userRepository.create(entity)
        return await this.userRepository.save(newUser)
    }

    async findAll(): Promise<Array<User>> {
        return await this.userRepository.find()
    }

    async findOneById(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({id})
    }

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {phoneNumber}
        })
    }

    async update(entity: User): Promise<User | null> {
        return await this.userRepository.save(entity)
    }

    async delete(entity: User): Promise<User | null> {
        return await this.userRepository.remove(entity)
    }
}