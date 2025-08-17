import { History } from "../entities/history.entity";

export interface IHistoryRepository {
  create(dto: History): Promise<History>;
  findAll(userId: string): Promise<Array<History>>;
  update(entity: History): Promise<History>;
  delete(entity: History): Promise<History>;
  findById(id: string): Promise<History | null>;
}
