import { Resolver, Query, Arg, Mutation } from 'type-graphql';

import { Order } from '../../entities/Order';
import { OrderRepository } from './repository';
import {
  CreateOrderInput,
  OrderQueryResponse,
  OrderMutationResponse
} from './types';
import { removeNull } from '../../utils/object-helpers';
import { ERROR_MESSAGES } from '../../constants';

@Resolver(Order)
export class OrderResolver {
  #orderRepository = OrderRepository.getRepository();

  @Query(() => OrderQueryResponse)
  async orders(
    @Arg('tableId') tableId: string,
    @Arg('sessionId') sessionId: string
  ): Promise<OrderQueryResponse> {
    const response = new OrderQueryResponse({
      list: [],
      count: 0
    });

    try {
      const [list, count] = await this.#orderRepository.getList({
        where: removeNull({
          tableId,
          sessionId
        })
      });

      response.list = list;
      response.count = count;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }

  @Mutation(() => OrderMutationResponse)
  async createOrder(
    @Arg('data') data: CreateOrderInput
  ): Promise<OrderMutationResponse> {
    const response = new OrderMutationResponse();

    try {
      const order = await this.#orderRepository.createAndSave(data);

      response.data = order;
    } catch (e) {
      response.error = ERROR_MESSAGES.SYSTEM_ERROR;
    }

    return response;
  }
}
