import { Resolver, Query, Arg, Mutation, UseMiddleware } from 'type-graphql';

import { Item } from '../../entities';
import { isAuth } from '../../middlewares';
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants';
import { ItemRepository } from './repository';
import { removeNull } from '../../utils/object-helpers';
import {
  ItemMutationResponse,
  ItemQueryResponse,
  CreateItemInput,
  UpdateItemInput
} from './types';
import { createFieldError } from '../../utils/error-helpers';

@Resolver(Item)
export class ItemResolver {
  #itemRepository = ItemRepository.getRepository();

  @Query(() => ItemQueryResponse)
  async items(
    @Arg('menuId') menuId: string,
    @Arg('categoryId', { nullable: true }) categoryId?: string
  ): Promise<ItemQueryResponse> {
    const response = new ItemQueryResponse({
      list: [],
      count: 0
    });

    try {
      const [list, count] = await this.#itemRepository.getList({
        where: removeNull({ menuId, categoryId })
      });

      response.list = list;
      response.count = count;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ItemMutationResponse)
  async createItem(
    @Arg('data') data: CreateItemInput
  ): Promise<ItemMutationResponse> {
    const response = new ItemMutationResponse();

    try {
      const item = await this.#itemRepository.createAndSave(data);

      response.data = item;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('name', 'Item already exists');
      } else {
        response.error = 'Something went wrong!';
      }
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ItemMutationResponse)
  async updateItem(
    @Arg('data') data: UpdateItemInput
  ): Promise<ItemMutationResponse> {
    const response = new ItemMutationResponse();

    try {
      const item = await this.#itemRepository.updateItem(data);

      response.data = item;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('name', 'Item already exists');
      } else {
        response.error = 'Something went wrong!';
      }
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteItem(@Arg('id') id: string): Promise<boolean> {
    try {
      const result = await this.#itemRepository.deleteItem(id);

      return Boolean(result?.affected && result.affected > 0);
    } catch (err) {
      throw new Error(`Failed to delete item: ${id}`);
    }
  }
}
