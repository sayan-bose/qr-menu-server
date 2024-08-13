import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware
} from 'type-graphql';

import { Category } from '../../entities';
import { Context } from '../../types';
import { isAuth } from '../../middlewares';
import { CategoryRepository } from './repository';
import { removeNull } from '../../utils/object-helpers';
import {
  CategoryQueryResponse,
  CategoryMutationResponse,
  CreateCategoryInput
} from './types';
import { createFieldError } from '../../utils/error-helpers';
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants';

@Resolver(Category)
export class CategoryResolver {
  #categoryRepository = CategoryRepository.getRepository();

  @Query(() => CategoryQueryResponse)
  async categories(
    @Ctx() { req }: Context,
    @Arg('menuId', { nullable: true }) menuId?: string
  ): Promise<CategoryQueryResponse> {
    const response = new CategoryQueryResponse({
      list: [],
      count: 0
    });

    try {
      const { userId } = req.session;

      const [list, count] = await this.#categoryRepository.getList({
        where: removeNull({ userId, menuId })
      });

      response.list = list;
      response.count = count;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Query(() => Category, { nullable: true })
  async categoryInfo(
    @Arg('id', () => String) id: string
  ): Promise<Category | undefined> {
    try {
      return await this.#categoryRepository.getById(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => CategoryMutationResponse)
  async createCategory(
    @Ctx() { req }: Context,
    @Arg('data') data: CreateCategoryInput
  ): Promise<CategoryMutationResponse> {
    const response = new CategoryMutationResponse();

    const { userId } = req.session;

    try {
      const category = await this.#categoryRepository.createAndSave({
        ...data,
        userId
      });

      response.data = category;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('name', 'Item already exists');
      } else {
        response.error = 'Something went wrong!';
      }
    }

    return response;
  }
}
