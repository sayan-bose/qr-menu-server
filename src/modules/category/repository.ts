import { EntityRepository, getConnection, Repository } from 'typeorm';

import { Category } from '../../entities';
import { CategoryQueryParams, CreateCategoryInput } from './types';
import { DatabaseOperations } from '../../types';

@EntityRepository(Category)
export class CategoryRepository
  extends Repository<Category>
  implements DatabaseOperations<Category>
{
  private readonly _join = {
    alias: 'category',
    leftJoinAndSelect: {
      menu: 'category.menu'
    }
  };

  public async createAndSave(
    payload: CreateCategoryInput & { userId: string }
  ): Promise<Category | undefined> {
    return await this.save(Category.construct(payload));
  }

  public async getList(
    queryParams: CategoryQueryParams
  ): Promise<[Category[], number]> {
    const { where } = queryParams;

    return await this.findAndCount({
      order: {
        updatedAt: 'DESC'
      },
      ...queryParams,
      join: !where?.menuId ? this._join : undefined
    });
  }

  public async getById(id: string): Promise<Category | undefined> {
    return await this.findOne({
      where: { id }
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(CategoryRepository);
  }
}
