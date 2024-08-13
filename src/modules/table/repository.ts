import { EntityRepository, getConnection, Repository } from 'typeorm';

import { Table } from '../../entities';
import { CreateTableInput, TableQueryParams } from './types';

@EntityRepository(Table)
export class TableRepository extends Repository<Table> {
  public async createAndSave(
    payload: CreateTableInput & { userId: string }
  ): Promise<Table | undefined> {
    return await this.save(Table.construct(payload));
  }

  public async getById(id: string): Promise<Table | undefined> {
    return await this.findOne({
      where: { id }
    });
  }

  public async getList(
    queryParams: TableQueryParams
  ): Promise<[Table[], number]> {
    return await this.findAndCount({
      order: {
        updatedAt: 'DESC'
      },
      ...queryParams
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(TableRepository);
  }
}
