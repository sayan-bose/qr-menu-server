import { EntityRepository, getConnection, Repository } from 'typeorm';

import { OrderItem } from '../../entities/OrderItem';
import { CreateOrderItemInput } from './types';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {
  public async createAndSave(
    orderId: string,
    cartItems: Array<CreateOrderItemInput> = []
  ): Promise<OrderItem[] | undefined> {
    return await this.save(
      cartItems.map((item) => OrderItem.construct({ ...item, orderId }))
    );
  }

  public async getList(orderId: string): Promise<[OrderItem[], number]> {
    return await this.findAndCount({
      order: {
        updatedAt: 'ASC'
      },
      where: {
        orderId
      }
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(OrderItemRepository);
  }
}
