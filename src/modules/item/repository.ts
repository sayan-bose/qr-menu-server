import {
  DeleteResult,
  EntityRepository,
  getConnection,
  Repository
} from 'typeorm';

import { Item, Option } from '../../entities';
import { CreateItemInput, ItemQueryParams, UpdateItemInput } from './types';
import { OptionRepository } from '../option/repository';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  #optionRepository = OptionRepository.getRepository();

  private readonly _join = {
    alias: 'item',
    leftJoinAndSelect: {
      options: 'item.options'
    }
  };

  public async createAndSave(
    payload: CreateItemInput
  ): Promise<Item | undefined> {
    const { options, ...intemInput } = payload;

    const item = await this.save(Item.construct(intemInput));

    const po: Option[] =
      (await this.#optionRepository.createAndSave(item.id, options)) ?? [];

    item.options = po;

    return item;
  }

  public async getList(
    queryParams: ItemQueryParams
  ): Promise<[Item[], number]> {
    return await this.findAndCount({
      order: {
        updatedAt: 'DESC'
      },
      ...queryParams,
      join: this._join
    });
  }

  public async getById(id: string): Promise<Item | undefined> {
    return await this.findOne({
      where: { id },
      join: this._join
    });
  }

  public async updateItem(data: UpdateItemInput): Promise<Item> {
    const { id, options, ...intemInput } = data;

    const item = await this.save({ id, ...intemInput });

    if (options) {
      const po: Option[] = await this.#optionRepository.updateAndSave(
        id,
        options
      );

      item.options = po;
    }

    return item;
  }

  public async deleteItem(itemId: string): Promise<DeleteResult | undefined> {
    const optoinResult = await this.#optionRepository.delete({ itemId });

    let itemResult;

    if (optoinResult?.affected) {
      itemResult = await this.delete(itemId);
    }

    return itemResult;
  }

  static getRepository() {
    return getConnection().getCustomRepository(ItemRepository);
  }
}
