import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware
} from 'type-graphql';

import { Menu } from '../../entities';
import { Context } from '../../types';
import { isAuth } from '../../middlewares';
import { MenuRepository } from './repository';
import {
  MenuQueryResponse,
  MenuMutationResponse,
  CreateMenuInput
} from './types';
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants';
import { createFieldError } from '../../utils/error-helpers';

@Resolver(Menu)
export class MenuResolver {
  #menuRepository = MenuRepository.getRepository();

  @UseMiddleware(isAuth)
  @Query(() => MenuQueryResponse)
  async menus(@Ctx() { req }: Context): Promise<MenuQueryResponse> {
    const { userId } = req.session;

    const response = new MenuQueryResponse({
      list: [],
      count: 0
    });

    try {
      const [list, count] = await this.#menuRepository.getList({
        where: { userId }
      });

      response.list = list;
      response.count = count;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Query(() => Menu, { nullable: true })
  async menuInfo(
    @Arg('id', () => String) id: string
  ): Promise<Menu | undefined> {
    try {
      return await this.#menuRepository.getById(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => MenuMutationResponse)
  async createMenu(
    @Ctx() { req }: Context,
    @Arg('data') data: CreateMenuInput
  ): Promise<MenuMutationResponse> {
    const { userId } = req.session;

    const response = new MenuMutationResponse();

    try {
      const menu = await this.#menuRepository.createAndSave({
        ...data,
        userId
      });

      response.data = menu;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('name', 'Menu already exists');
      } else {
        response.error = ERROR_MESSAGES.SYSTEM_ERROR;
      }
    }

    return response;
  }
}
