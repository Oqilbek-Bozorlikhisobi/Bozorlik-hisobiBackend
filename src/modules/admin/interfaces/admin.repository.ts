import { Admin } from '../entities/admin.entity';

export interface IAdminRepository {
  findAll(): Promise<Array<Admin>>;
  findOneById(id: string): Promise<Admin | null>;
  create(entity: Admin): Promise<Admin>;
  update(entity: Admin): Promise<Admin | null>;
  delete(entity: Admin): Promise<Admin | null>;

  findByLogin(login: string): Promise<Admin | null>;
}
