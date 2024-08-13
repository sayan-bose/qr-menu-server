import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import JWT from 'jsonwebtoken';

import { Table } from '../../entities';
import { Context } from '../../types';
import { isAuth } from '../../middlewares';

import { TableRepository } from './repository';
import {
  TableQueryResponse,
  TableMutationResponse,
  CreateTableInput
} from './types';
import { createFieldError } from '../../utils/error-helpers';
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants';

@Resolver(Table)
export class TableResolver {
  #tableRepository = TableRepository.getRepository();

  private generateToken = (menuId: string, userId: string): string => {
    return JWT.sign(
      {
        menuId,
        userId,
        accessToken: uuidv4()
      },
      'qr_menu_client_secret'
    );
  };

  @UseMiddleware(isAuth)
  @Query(() => TableQueryResponse)
  async tables(
    @Ctx() { req }: Context,
    @Arg('menuId') menuId: string
  ): Promise<TableQueryResponse> {
    const response = new TableQueryResponse({
      list: [],
      count: 0
    });

    const { userId } = req.session;

    try {
      const [list, count] = await this.#tableRepository.getList({
        where: { userId, menuId }
      });

      response.list = list;
      response.count = count;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => TableMutationResponse)
  async createTable(
    @Ctx() { req }: Context,
    @Arg('data') data: CreateTableInput
  ): Promise<TableMutationResponse> {
    const response = new TableMutationResponse();

    const { userId } = req.session;

    try {
      const payload = {
        ...data,
        userId,
        qrToken: this.generateToken(data.menuId, userId)
      };

      const table = await this.#tableRepository.createAndSave({ ...payload });

      response.data = table;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('name', 'Table already exists');
      } else {
        response.error = 'Something went wrong!';
      }
    }

    return response;
  }
}
