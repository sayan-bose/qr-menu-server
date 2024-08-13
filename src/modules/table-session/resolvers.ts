import { Resolver, Arg, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';

import { randomHex } from '../../utils/crypto-helpers';
import { Context, SessionStatus } from '../../types';
import { isAuth } from '../../middlewares';
import { TableSessionMutationResponse, CreateTableSessionInput } from './types';
import { ERROR_MESSAGES } from '../../constants';

const HRS = 3600;

@Resolver()
export class TableSessionResolver {
  @Mutation(() => TableSessionMutationResponse)
  async createTableSession(
    @Ctx() { redis }: Context,
    @Arg('input') input: CreateTableSessionInput
  ): Promise<TableSessionMutationResponse> {
    const response = new TableSessionMutationResponse();

    const { tableId, menuId } = input;

    const sessionKey = `${menuId}@${tableId}`;
    const sessionId = uuidv4();
    const accessKey = randomHex(4).toUpperCase();

    try {
      const existingSession = await redis.get(sessionKey);

      if (!existingSession) {
        const isOk = await redis.set(
          sessionKey,
          JSON.stringify([sessionId, accessKey]),
          'ex',
          HRS
        );

        if (isOk) {
          response.data = { sessionId, accessKey };
        }
      }

      response.data = { status: SessionStatus.OCCUPIED };
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @Mutation(() => TableSessionMutationResponse)
  async mergeTableSession(
    @Ctx() { redis }: Context,
    @Arg('input') input: CreateTableSessionInput
  ): Promise<TableSessionMutationResponse> {
    const response = new TableSessionMutationResponse();

    const { tableId, menuId, guestKey } = input;

    try {
      const existingSession = await redis.get(`${menuId}@${tableId}`);

      if (existingSession) {
        const [sessionId, accessKey] = JSON.parse(existingSession);

        if (guestKey === accessKey) {
          response.data = { sessionId, accessKey };
        }
      }
      response.data = { status: SessionStatus.INVALID_ACCESS };
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => TableSessionMutationResponse)
  async endTableSession(
    @Ctx() { redis }: Context,
    @Arg('input') input: CreateTableSessionInput
  ): Promise<TableSessionMutationResponse> {
    const response = new TableSessionMutationResponse();

    const { tableId, menuId } = input;

    const sessionKey = `${menuId}@${tableId}`;

    try {
      const count = await redis.del(sessionKey);

      response.data = {
        status: count > 0 ? SessionStatus.CLOSED : SessionStatus.UNOCCUPIED
      };
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @Mutation(() => TableSessionMutationResponse)
  async validateTableSession(
    @Arg('input') input: CreateTableSessionInput,
    @Ctx() { redis }: Context
  ): Promise<TableSessionMutationResponse> {
    const response = new TableSessionMutationResponse();

    const { tableId, menuId, sessionId } = input;

    const sessionKey = `${menuId}@${tableId}`;

    try {
      const existingSession = await redis.get(sessionKey);

      if (existingSession) {
        const [storedId, accessKey] = JSON.parse(existingSession);

        if (sessionId === storedId) {
          response.data = {
            sessionId,
            accessKey
          };
        }
      }

      response.data = { status: SessionStatus.INVALID_ACCESS };
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }
}
