import { InjectRepository } from '@nestjs/typeorm';
import { IAdminRepository } from './interfaces/admin.repository';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(entity: Admin): Promise<Admin> {
    const newAdmin = await this.adminRepository.create(entity);
    return await this.adminRepository.save(newAdmin);
  }

  async findAll(): Promise<Array<Admin>> {
    return await this.adminRepository.find();
  }

  async findOneById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findOneBy({ id });
  }

  async findByLogin(login: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { login },
    });
  }

  async update(entity: Admin): Promise<Admin | null> {
    return await this.adminRepository.save(entity);
  }

  async delete(entity: Admin): Promise<Admin | null> {
    return await this.adminRepository.remove(entity);
  }
}
