import { EntityRepository, getConnection, Repository } from 'typeorm';

import { Menu } from '../../entities';
import { CreateMenuInput, MenuQueryParams } from './types';

@EntityRepository(Menu)
export class MenuRepository extends Repository<Menu> {
  public async createAndSave(
    payload: CreateMenuInput & { userId: string }
  ): Promise<Menu | undefined> {
    return await this.save(Menu.construct(payload));
  }

  public async getList(
    queryParams: MenuQueryParams
  ): Promise<[Menu[], number]> {
    return await this.findAndCount({
      order: {
        updatedAt: 'DESC'
      },
      ...queryParams
    });
  }

  public async getById(id: string): Promise<Menu | undefined> {
    return await this.findOne({
      where: { id }
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(MenuRepository);
  }
}
