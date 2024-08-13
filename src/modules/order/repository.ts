import { OrderItem } from '../../entities/OrderItem';
import { EntityRepository, getConnection, Repository } from 'typeorm';

import { Order } from '../../entities/Order';
import { OrderItemRepository } from '../order-item/repository';
import { CreateOrderInput, OrderQueryParams } from './types';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  #orderItemRepository = OrderItemRepository.getRepository();

  private readonly _join = {
    alias: 'order',
    leftJoinAndSelect: {
      orderItems: 'order.orderItems'
    }
  };

  public async createAndSave(
    payload: CreateOrderInput
  ): Promise<Order | undefined> {
    const { orderItems, ...orderInput } = payload;
    const order = await this.save(Order.construct(orderInput));

    const poi: OrderItem[] =
      (await this.#orderItemRepository.createAndSave(order.id, orderItems)) ??
      [];

    order.orderItems = poi;

    return order;
  }

  public async getList(
    queryParams: OrderQueryParams
  ): Promise<[Order[], number]> {
    return await this.findAndCount({
      order: {
        updatedAt: 'ASC'
      },
      ...queryParams,
      join: this._join
    });
  }

  public async getById(id: string): Promise<Order | undefined> {
    return await this.findOne({
      where: { id }
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(OrderRepository);
  }
}
